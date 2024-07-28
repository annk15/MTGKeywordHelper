import requests
import mysql.connector
import re
import time

db_config = {
  "host": "127.0.0.1",
  "port": 3307,
  "user": "root",
  "password": "password"
}

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
              infoboxText = parseText(text, r"{{Infobox keyword(.*?)}}")
          else:
              print("WARNING : Failed to parse infobox for keyword " + keyword)
          if infoboxText is not None:
              return parseText(infoboxText, r"\| reminder\s*=\s*([^|]*)\|"), url
          else:
              print("WARNING : Failed to parse remainder text for keyword " + keyword)
      except KeyError:
          data = None
          print(
              "INFO : Wiki not found for keyword "
              + keyword
              + ", this keyword will be ignored"
          )
  else:
      print(f"ERROR : description website responded with: {response.status_code}")
  return None, url

def fetchKeyImage(keyword):

    keyword = keyword.replace(" ","+oracle%3A").lower()
    url = "https://api.scryfall.com/cards/random?q=oracle%3A"+keyword

    print("INFO | Will fetch image from url " + url)

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
      print(f"ERROR : card image website responded with: {response.status_code}")

    return data

def fetchKeywords():

  url = "https://api.scryfall.com/catalog/keyword-abilities"
  response = requests.get(url)
  data = None
  if response.status_code == 200:
      data = response.json()
      data = data["data"]
  else:
      print(f"ERROR : keywords website responded with: {response.status_code}")

  return data

def main():

  print("-------------------------------------------------------------")
  print("Adding keywords and descriptions to the database, please wait")
  print("-------------------------------------------------------------")

  initDB()

  keywords = fetchKeywords()
  for keyword in keywords:
      description, url = getKeyDescription(keyword)
      if description is not None:
          print(keyword + " | " + description + " | " + url)
          updateDescriptionDB(keyword, description, url)

          image = fetchKeyImage(keyword)
          if image is not None:
              updateImageDB(keyword, image)

  print("--------")
  print("COMPLETE")
  print("--------")

if __name__ == "__main__":
  main()
