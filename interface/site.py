from flask import Flask, render_template
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def serve_index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run('0.0.0.0', port=8080, debug=True)
