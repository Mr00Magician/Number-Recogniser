from flask import Flask, render_template, request, jsonify
import numpy as np
import tensorflow as tf
import cv2

app = Flask(__name__, template_folder='../client/build', static_folder='../client/build/static')

loaded_CNN = tf.keras.models.load_model('CNN_extended_dataset.h5')

CANVAS_H, CANVAS_W = 400, 400

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get-prediction', methods = ['POST'])
def get_prediction():
    img_array = request.json.get('data')
    img_array = np.array(img_array, dtype=np.uint8).reshape(400, 400)
    ret, thresh = cv2.threshold(img_array, 157, 255, cv2.THRESH_BINARY)
    contours, heirarchy = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=lambda c: cv2.boundingRect(c)[0])
    pred = 0
    for contour in contours:
        black_img = np.zeros(shape=(400, 400))

        x, y, w, h = cv2.boundingRect(contour)
        start_x = CANVAS_W // 2 - w // 2
        start_y = CANVAS_H // 2 - h // 2
        end_x = CANVAS_W // 2 + ((w // 2) if (w % 2 == 0) else (w // 2 + 1)) 
        end_y = CANVAS_H // 2 + ((h // 2) if (h % 2 == 0) else (h // 2 + 1))
       
        black_img[start_y: end_y, start_x: end_x] = img_array[y: y + h, x: x + w]

        if h < 180:
            factor = 180 - h
            black_img = black_img[factor: CANVAS_H - factor, factor: CANVAS_W - factor]

        # cv2.namedWindow('contours', cv2.WINDOW_NORMAL)
        # cv2.imshow('contours', black_img)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

        black_img = cv2.resize(black_img, (28, 28))
        black_img = black_img.reshape(1, 28, 28)

        pred = pred * 10 + np.argmax(loaded_CNN.predict([black_img]))
    return str(pred)

if __name__ == '__main__':
    app.run(debug=True)