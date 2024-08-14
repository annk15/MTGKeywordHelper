import requests
import mysql.connector
import re
import time
import urllib.parse
from enum import Enum

db_config = {
  "host": "127.0.0.1",
  "port": 3307,
  "user": "root",
  "password": "password"
}

keywords_source_url = "https://mtg.fandom.com/api.php?action=query&format=json&formatversion=2&list=categorymembers&cmlimit=500&cmtitle=Category%3AGlossary"
reminder_source_url = "https://mtg.fandom.com/api.php?format=json&action=query&prop=revisions&rvprop=content&explaintext&redirects=1&titles="
image_source_url = "https://api.scryfall.com/cards/random?q=oracle%3A"

debug = True

class LoggType(Enum):
    ERROR = 1
    WARNING = 2
    INFO = 3

def logg(text, type = None):

    if type is None:
        print(text)
        return

    if debug or type is LoggType.ERROR:
        print(type.name + " : " +  text)

def init_database():

  try:

      cnx = mysql.connector.connect(**db_config)
      cursor = cnx.cursor()

      cursor.execute(
              """
              CREATE DATABASE IF NOT EXISTS
              mtg;
              """)

      cursor.execute(
              """
              USE mtg;
              """)

      cursor.execute(
              """
              CREATE TABLE IF NOT EXISTS
              keyword_reminders(keyword varchar(50) PRIMARY KEY, reminder_text varchar(500));
              """)

      cursor.execute(
              """
              CREATE TABLE IF NOT EXISTS
              keyword_images(keyword varchar(50) PRIMARY KEY, image LONGBLOB NOT NULL);
              """)

      cnx.commit()

  finally:

      if cursor:
          cursor.close()
          if cnx:
              cnx.close()

def update_database_reminders(keyword, reminder_text):

  try:

      cnx = mysql.connector.connect(**db_config)
      cursor = cnx.cursor()

      cursor.execute(
              """
              USE mtg;
              """)

      cursor.execute(
              """
              INSERT INTO keyword_reminders (keyword, reminder_text)
              VALUES (%s, %s)
              ON DUPLICATE KEY UPDATE reminder_text = %s;
              """, (keyword, reminder_text, reminder_text))

      cnx.commit()

  finally:

      if cursor:
          cursor.close()
          if cnx:
              cnx.close()

def update_database_image(keyword, image):

  try:

      cnx = mysql.connector.connect(**db_config)
      cursor = cnx.cursor()

      cursor.execute(
              """
              USE mtg;
              """)

      cursor.execute(
              """
              INSERT INTO keyword_images (keyword, image)
              VALUES (%s, %s)
              ON DUPLICATE KEY UPDATE image = %s;
              """, (keyword, image, image))

      cnx.commit()

  finally:

      if cursor:
          cursor.close()
          if cnx:
              cnx.close()

def clean_reminder(text):

    cleaned_text = re.sub(r"<[^>]+/?>(?:</[^>]+>)?", '', text)
    cleaned_text = re.sub(r"\[\[(.*?)\]\]", r"[\1]", cleaned_text)
    cleaned_text = re.sub(r"{{T}}", "(Tap)", cleaned_text)
    cleaned_text = re.sub(r"{{(\d+|X)}}", r"(\1 Colorless)", cleaned_text)


    if cleaned_text != text:
        logg(f"Reminder text was cleaned,\noriginal text : \"{text}\"\ncleaned text : \"{cleaned_text}\"", LoggType.INFO)

    return cleaned_text

def fetch_keyword_reminder(keyword):

  keyword = keyword.replace(" ", "_")

  url = (reminder_source_url + urllib.parse.quote(keyword))

  logg("Will fetch data from URL : " + url, LoggType.INFO)

  response = requests.get(url)

  if response.status_code == 200:
      try:

          data = response.json()
          text = list(data["query"]["pages"].values())[0]["revisions"][0]["*"]

          if not text:
            logg("Failed to parse infobox for keyword " + keyword, LoggType.WARNING)
            return None

          infobox_text = re.findall(r'\{\{Infobox [^\|]*\|(.*?)\n\}\}', text, re.DOTALL)

          logg("Parsed infobox : " + str(infobox_text), LoggType.INFO)

          if not infobox_text:
            logg("Failed to find infobox for keyword " + keyword + " at page " + url, LoggType.WARNING)
            return None

          reminder = re.findall(r"\|\s*\b(reminder|text|rules)\b\s*=\s*(.*?)\n\|", infobox_text[0])

          logg("Parsed reminder : " + str(reminder), LoggType.INFO)

          if not reminder:
            logg("Failed to find reminder text for keyword " + keyword, LoggType.WARNING)
          else:
            return clean_reminder(reminder[0][1])

      except KeyError:
          data = None
          logg("Wiki not found for keyword", LoggType.WARNING)

  else:
      logg(f"Description site responded with: {response.status_code}", LoggType.WARNING)

  return None

def fetch_keyword_image(keyword):

    keyword = keyword.replace(" ","+oracle%3A").lower()
    url = image_source_url+keyword

    logg("Will fetch image from url " + url, LoggType.INFO)

    response = requests.get(url)
    if response.status_code == 200:

      data = response.json()

      # If card only exist in one version it will be available at top level, if not we pick the first version of the card
      if "image_uris" in data:
        image_url = data["image_uris"]["art_crop"]
      else:
        image_url = data["card_faces"][0]["image_uris"]["art_crop"]

      response = requests.get(image_url)
      response.raise_for_status()  # Check if the request was successful

      return response.content

    else:
      logg(f"Image site at {url} with keyword {keyword} responded with: {response.status_code}", LoggType.WARNING)

    return None

def fetch_keyword_blacklist():
    filename = "blacklist.txt"
    try:
        with open(filename, 'r') as file:
            lines = file.readlines()
            lines = [line.strip().lower() for line in lines]
            return lines
    except FileNotFoundError:
        logg(f"Failed to open blacklist file {filename}, all keywords will be allowed!", LoggType.INFO)
        return []

def fetch_keywords(url):
    keywords = []
    original_url = url

    keyword_blacklist = fetch_keyword_blacklist()

    while True:
        response = requests.get(url)
        if response.status_code == 200:

            data = response.json()

            keywords.extend(data["query"]["categorymembers"])

            if "continue" in data:
                url = original_url + "&cmcontinue=" + data["continue"]["cmcontinue"]
            else:
                break

        else:
            logg(f"Keywords website responded with: {response.status_code}", LoggType.ERROR)
            break

    logg(f"Blacklisted keywords : {keyword_blacklist} will not be processed!", LoggType.INFO)

    stripped_keywords = []
    for keyword in keywords:

        keyword = keyword['title']

        if keyword.lower() not in keyword_blacklist:
            stripped_keywords.append(keyword)
        else:
            logg(f"Keyword {keyword} is blacklisted and will not be processed!", LoggType.WARNING)

    return stripped_keywords

def main():

    logg("Adding keywords and descriptions to the database, please wait")

    init_database()

    keyword_count = 0
    failed_keywords = []

    fetch_start_time = time.time()

    keywords = fetch_keywords(keywords_source_url)

    #keywords = ["amass"]

    for keyword in keywords:

        logg("Processing keyword : " + keyword, LoggType.INFO)

        keyword_reminder = fetch_keyword_reminder(keyword)

        if not keyword_reminder:
            failed_keywords.append(keyword)
            continue

        image = fetch_keyword_image(keyword)

        if not image:
            logg("No image found for keyword", LoggType.WARNING)
            continue

        logg("Successfully fetched image for keyword", LoggType.INFO)

        update_database_reminders(keyword, keyword_reminder)
        update_database_image(keyword, image)
        keyword_count += 1

        logg("Added keyword " + keyword + " to database!")
        logg("Successfully fetched description : " + keyword_reminder, LoggType.INFO)

    logg("Successfully fetched : " + str(keyword_count) + " keywords \n"
        "Failed to fetch the following keywords : " + str(failed_keywords) + "\n"
        + "Total runtime : " + str(int(time.time() - fetch_start_time)) + " seconds")

if __name__ == "__main__":
  main()
