from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"name": "anas"})

if __name__ == '__main__':
    app.run(debug=True)