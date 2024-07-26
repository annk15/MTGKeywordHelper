import requests
import mysql.connector
import re

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
              keyword_abilities(Keyword varchar(50), Description varchar(500));
              """)
        
      cnx.commit()
      
  finally:
      if cursor:
          cursor.close()
          if cnx:
              cnx.close()

def updateDB(keyword, description):
  
  try:
      cnx = mysql.connector.connect(**db_config)
      cursor = cnx.cursor()
      
      cursor.execute(
              """
              USE mtg;
              """)
      
      cursor.execute(      
              """
              INSERT INTO keyword_abilities (keyword, description)
              VALUES (%s, %s)
              ON DUPLICATE KEY UPDATE description = %s;
              """, (keyword, description, description))
        
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
              return parseText(infoboxText, r"\| reminder\s*=\s*([^|]*)\|")
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
  return None

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
      description = getKeyDescription(keyword)
      if description is not None:
          print(keyword + " | " + description)
          updateDB(keyword, description)
  
  print("--------")
  print("COMPLETE")
  print("--------")

if __name__ == "__main__":
  main()
