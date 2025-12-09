from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({"message": "Hello World"})

if __name__ == '__main__':
    print("Starting minimal Flask test...")
    app.run(host='127.0.0.1', port=5001, debug=False)
