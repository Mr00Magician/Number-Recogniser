import React, { useLayoutEffect, useRef } from "react";
import './Canvas.css';

export default function Canvas(){
    var canvas = useRef(null);
    var ctx = useRef(null);
    const canDraw = useRef(false);
    
    const mouse = {
        currX: null,
        currY: null,
        prevX: null,
        prevY: null
    }

    useLayoutEffect( () => {
        canvas.current = document.querySelector('canvas');
        ctx.current = canvas.current.getContext('2d');
        canvas.current.width = 400;
        canvas.current.height = 400;
    })
    
    function cursorPosInCanvas(x ,y){
        if(!canvas.current) return null;
        const boundingRect = canvas.current.getBoundingClientRect();
        return {
            x: x - boundingRect.left,
            y: y - boundingRect.top
        }
    }

    function drawLine(){
        ctx.current.beginPath();
        ctx.current.lineWidth = 20;
        ctx.current.strokeStyle = 'black';
        ctx.current.moveTo(mouse.prevX, mouse.prevY);
        ctx.current.lineTo(mouse.currX, mouse.currY);
        ctx.current.stroke();
    }
    
    function drawCircle(){
        ctx.current.fillStyle = 'black';
        ctx.current.beginPath();
        ctx.current.arc(mouse.currX, mouse.currY, 10, 0, Math.PI * 2);
        ctx.current.fill();
    }

    function handleMouseDown(e){
        canDraw.current = true;
    }

    function handleMouseUp(e){
        canDraw.current = false;
    }

    function handleMouseMove(e){
        let {x, y} = cursorPosInCanvas(e.clientX, e.clientY);
        if (!mouse.prevX){
            mouse.prevX = x;
            mouse.prevY = y;
            mouse.currX = x;
            mouse.currY = y;
        }
        if(canDraw.current) {
            drawCircle();
            drawLine();
        }
        mouse.prevX = mouse.currX;
        mouse.prevY = mouse.currY;
        mouse.currX = x;
        mouse.currY = y;
    }
    
    function clearCanvas(e){
        ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
    }

    function toGrayscale(imgData){
        const data = imgData.data;
        const grayscaleData = [];

        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            
            const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;
            
            grayscaleData.push(grayscale);
        }
        return grayscaleData;
        // const grayscaleImg = [];
        // for (let i = 0; i < height; i++){
        //     const row = grayscaleData.slice(i * width, i * width + width);
        //     grayscaleImg.push(row);
        // }
        // do reshaping to 400 by 400 and then resizing to 28 by 28 at backend via cv2
    }

    function getPrediction(imgData){
        fetch('./get-prediction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data: imgData})
        }).then(
            res => res.json()
        ).then(data => {
            console.log(data);
            return data;
        }
        ).catch(
            err => console.warn('something went wrong', err)
        )
        return null;
    }

    function ShowPrediction(pred){
        const textarea = document.querySelector('#prediction-area textarea');
        textarea.value = pred;
    }
    
    function predict(){
        const imgData = ctx.current.getImageData();
        const grayscaleData = toGrayscale(imgData);
        const pred = getPrediction(grayscaleData);
        ShowPrediction(pred);
    }

    return (
        <div id = "canvas-container">
            <canvas
                onMouseMove = {handleMouseMove}
                onMouseDown = {handleMouseDown}
                onMouseUp = {handleMouseUp}
            />
            <div id = "prediction-area">
                <label>prediction</label>
                <textarea disabled></textarea>
            </div>
            <button className = "canvas-button" onClick = {clearCanvas}>clear</button>
            <button className = "canvas-button" onClick = {predict}>Predict</button>
        </div>
    )
}