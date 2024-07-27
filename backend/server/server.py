from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

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

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
    return None

@app.route('/keyword-abilities', methods=['GET'])
def get_items():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM keyword_abilities")
    items = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(items), 200

if __name__ == '__main__':
    app.run(debug=True)
