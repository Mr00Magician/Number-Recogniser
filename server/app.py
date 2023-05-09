from flask import Flask, render_template, request, jsonify
import numpy as np
import tensorflow as tf
import cv2
import matplotlib.pyplot as plt

app = Flask(__name__, template_folder='../client/build', static_folder='../client/build/static')

loaded_CNN = tf.keras.models.load_model('CNN_extended_dataset.h5') 

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get-prediction', methods = ['POST'])
def get_prediction():
    img_array = request.json.get('data')
    print(img_array)
    img_array = np.array(img_array, dtype=np.uint8).reshape(400, 400)
    img_array = cv2.resize(img_array, (28, 28))
    plt.imsave('imgData.png', img_array, cmap = 'gray')
    img_array = img_array.reshape(1, 28, 28)

    pred = loaded_CNN.predict([img_array])
    final_pred = np.argmax(pred)
    return str(final_pred)

if __name__ == '__main__':
    app.run()