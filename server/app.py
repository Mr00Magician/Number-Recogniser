from flask import Flask, render_template, request, jsonify

app = Flask(__name__, template_folder='../client/build', static_folder='../client/build/static')

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)