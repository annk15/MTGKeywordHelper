
from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

# Database configuration
DB_CONFIG = {
    'user': 'username',
    'password': 'password',
    'host': 'remote_host',
    'database': 'db_name'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
    return None

@app.route('/items', methods=['GET'])
def get_items():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM items")
    items = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(items), 200

@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM items WHERE id = %s", (item_id,))
    item = cursor.fetchone()
    cursor.close()
    connection.close()
    if item:
        return jsonify(item), 200
    else:
        return jsonify({"error": "Item not found"}), 404

@app.route('/items', methods=['POST'])
def create_item():
    data = request.json
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO items (name, description) VALUES (%s, %s)", (data['name'], data.get('description', '')))
    connection.commit()
    new_id = cursor.lastrowid
    cursor.close()
    connection.close()
    return jsonify({"id": new_id, "name": data['name'], "description": data.get('description', '')}), 201

@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.json
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE items SET name = %s, description = %s WHERE id = %s", (data.get('name'), data.get('description'), item_id))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"id": item_id, "name": data.get('name'), "description": data.get('description')}), 200

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM items WHERE id = %s", (item_id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Item deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)
