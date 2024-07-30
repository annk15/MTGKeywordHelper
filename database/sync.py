import requests
import mysql.connector
import re
from enum import Enum
import time

db_config = {
  "host": "127.0.0.1",
  "port": 3307,
  "user": "root",
  "password": "password"
}

debug = True

class LoggType(Enum):
    ERROR = 1
    WARNING = 2
    INFO = 3

def logg(text, type = None):

    if type is None:
        print()
        print(text)
        return

    if debug or type is LoggType.ERROR:
        print(type.name + " : " +  text)

def initDB():

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
              keyword_abilities(keyword varchar(50) PRIMARY KEY, description varchar(500), url varchar(500));
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

def updateDescriptionDB(keyword, description, url):

  try:

      cnx = mysql.connector.connect(**db_config)
      cursor = cnx.cursor()

      cursor.execute(
              """
              USE mtg;
              """)

      cursor.execute(
              """
              INSERT INTO keyword_abilities (keyword, description, url)
              VALUES (%s, %s, %s)
              ON DUPLICATE KEY UPDATE description = %s;
              """, (keyword, description, url, description))

      cnx.commit()

  finally:

      if cursor:
          cursor.close()
          if cnx:
              cnx.close()

def updateImageDB(keyword, image):

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

def parseText(text, pattern):

  match = re.search(pattern, text, re.DOTALL)

  if match:
      return match.group(1).strip()
  else:
      return None

def getKeyDescription(keyword):

  keyword = keyword.capitalize().replace(" ", "_")

  url = (
      "https://mtg.fandom.com/api.php?format=json&action=query&prop=revisions&rvprop=content&explaintext&redirects=1&titles="
      + keyword
  )

  response = requests.get(url)

  if response.status_code == 200:
      try:

          data = response.json()
          text = list(data["query"]["pages"].values())[0]["revisions"][0]["*"]

          if text is not None:
              infoboxText = parseText(text, r'\{\{Infobox\s\w+\n([\s\S]*?)\}\}')
          else:
              logg("Failed to parse infobox for keyword " + keyword, LoggType.WARNING)

          if infoboxText is not None:
              return parseText(infoboxText, r"\| reminder\s*=\s*([^|]*)\|"), url
          else:
              logg("Failed to parse remainder text for keyword " + keyword, LoggType.WARNING)

      except KeyError:
          data = None
          logg("Wiki not found for keyword " + keyword + ", this keyword will be ignored", LoggType.WARNING)

  else:
      logg(f"Description website responded with: {response.status_code}", LoggType.ERROR)

  return None, url

def fetchKeyImage(keyword):

    keyword = keyword.replace(" ","+oracle%3A").lower()
    url = "https://api.scryfall.com/cards/random?q=oracle%3A"+keyword

    logg("Will fetch image from url " + url, LoggType.INFO)

    response = requests.get(url)
    data = None

    if response.status_code == 200:

      data = response.json()

      # If card only exist in one version it will be available at top level, if not we pick the first version of the card
      if "image_uris" in data:
        imageUrl = data["image_uris"]["art_crop"]
      else:
        imageUrl = data["card_faces"][0]["image_uris"]["art_crop"]

      response = requests.get(imageUrl)
      response.raise_for_status()  # Check if the request was successful

      return response.content

    else:
      logg(f"Card image website responded with: {response.status_code}", LoggType.ERROR)

    return data

def fetchKeywords(url):

  response = requests.get(url)
  data = None

  if response.status_code == 200:
      data = response.json()
      data = data["data"]
  else:
      logg(f"Keywords website responded with: {response.status_code}", LoggType.ERROR)

  return data

def main():

  logg("Adding keywords and descriptions to the database, please wait")

  initDB()

  keywordAbilities = fetchKeywords("https://api.scryfall.com/catalog/keyword-abilities")
  keywordActions = fetchKeywords("https://api.scryfall.com/catalog/keyword-actions")

  keywordCount = 0
  descriptionsCount = 0
  imageCount = 0

  fetchStartTime = time.time()

  for keyword in keywordAbilities + keywordActions:

      logg("Processing keyword : " + keyword)
      keywordCount += 1

      description, url = getKeyDescription(keyword)
      if description is not None:

          logg("Successfully fetched description : " + description + "\n"
               + "From URL " + url, LoggType.INFO)
          descriptionsCount += 1

          updateDescriptionDB(keyword, description, url)

          image = fetchKeyImage(keyword)

          if image is not None:

              logg("Successfully fetched image for keyword", LoggType.INFO)
              imageCount += 1

              updateImageDB(keyword, image)

          else:
              logg("No image found for keyword", LoggType.WARNING)

  logg("Successfully fetched : \n"
       + str(keywordCount) + " keywords \n"
       + str(descriptionsCount) + " descriptions \n"
       + str(imageCount) + " images \n"
       + "Total time : " + str(int(time.time() - fetchStartTime)) + " seconds")

if __name__ == "__main__":

  main()
