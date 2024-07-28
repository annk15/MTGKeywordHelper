from flask import Flask, jsonify, make_response, send_file
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from io import BytesIO

app = Flask(__name__)
CORS(app)

# Database configuration
DB_CONFIG = {
  "host": "127.0.0.1",
  "port": 3307,
  "user": "root",
  "password": "password",
  "database": "mtg"
}

def getConnection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
    return None

def fetchImageBinary(keyword):
    connection = getConnection()
    cursor = connection.cursor()
    sql = "SELECT keyword, image FROM keyword_images WHERE keyword = %s"
    cursor.execute(sql, (keyword,))
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    if result:
        return BytesIO(result[1])
    return None

@app.route('/keyword-abilities', methods=['GET'])
def keywordAbilities():
    connection = getConnection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM keyword_abilities")
    items = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(items), 200

@app.route('/keyword-image/<string:keyword>', methods=['GET'])
def keywordImages(keyword):
    image = fetchImageBinary(keyword)
    if image:
        return send_file(image, mimetype='image/jpeg')
    else:
        return make_response('Image not found', 404)

if __name__ == '__main__':
    app.run(debug=True)
