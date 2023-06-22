import React, { useLayoutEffect, useRef, useState } from "react";
import './Canvas.css';

export default function Canvas(){
    var canvas = useRef(null);
    var ctx = useRef(null);
    const canDraw = useRef(false);
    
    const initialOrientation = window.innerHeight > window.innerWidth? 'portrait': 'landscape';
    var [orientation, setOrientation] = useState(initialOrientation);
    
    const mouse = {
        currX: null,
        currY: null,
        prevX: null,
        prevY: null
    }

    useLayoutEffect(() => {
        canvas.current = document.querySelector('canvas');
        ctx.current = canvas.current.getContext('2d');
        if (orientation === 'portrait')
            ctx.current.scale(400/320, 400/320);
        else
            ctx.current.scale(1.0, 1.0);
    }, [orientation])

    useLayoutEffect( () => {
        canvas.current = document.querySelector('canvas');
        ctx.current = canvas.current.getContext('2d');
        canvas.current.width = 400;
        canvas.current.height = 400;
        ctx.current.fillStyle = 'white'
        ctx.current.fillRect(0, 0, 400, 400);

        if (window.innerHeight > window.innerWidth) {
            ctx.current.scale(400/320, 400/320);
        }

        window.addEventListener('resize', e => {
            if (window.innerHeight > window.innerWidth)
                setOrientation('portrait');
            else
                setOrientation('landscape');
        })

        document.addEventListener('touchmove', function(event) {
            event.preventDefault();
          }, { passive: false });
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

    function handleTouchStart(e){
        canDraw.current = true;
    }

    function handleTouchEnd(e){
        canDraw.current = false;
        mouse.currX = null;
        mouse.currY = null;
        mouse.prevX = null;
        mouse.prevY = null;
    }

    function handleTouchMove(e){
        let touchX = e.touches[0].pageX;
        let touchY = e.touches[0].pageY;
        let {x, y} = cursorPosInCanvas(touchX, touchY);
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
        ctx.current.fillStyle = 'white'
        ctx.current.fillRect(0, 0, 400, 400);
    }

    function toGrayscale(imgData){
        const data = imgData.data;
        const grayscaleData = [];

        for (let i = 0; i < data.length; i += 4) {
            const red = 255 - data[i];
            const green = 255 - data[i + 1];
            const blue = 255 - data[i + 2];
            
            const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;
            
            grayscaleData.push(grayscale);
        }
        return grayscaleData;
    }

    async function getPrediction(imgData){
        let pred = null;
        await fetch('./get-prediction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data: imgData})
        }).then(
            res => res.json()
        ).then(data => {
            pred = data;
        }
        ).catch(
            err => console.warn('something went wrong', err)
        )
        return pred;
    }

    function ShowPrediction(pred){
        const textarea = document.querySelector('#prediction-area textarea');
        let predictButton = document.querySelector('.canvas-button.predict-button');
        textarea.value = pred;
        predictButton.innerHTML = 'Predict';
    }

    function showLoadingAnimation(){
        let predictButton = document.querySelector('.canvas-button.predict-button');
        predictButton.innerHTML = '<div class="loading"> </div>';
    }
    
    function predict(){
        showLoadingAnimation()
        const height = canvas.current.height
        const width = canvas.current.width
        const imgData = ctx.current.getImageData(0, 0, width, height);
        const grayscaleData = toGrayscale(imgData);
        const pred = getPrediction(grayscaleData);
        pred.then(data => ShowPrediction(data))
    }

    return (
        <div id = "canvas-container">
            <h3>Draw a number below</h3>
            <canvas
                onMouseMove = {handleMouseMove}
                onMouseDown = {handleMouseDown}
                onMouseUp = {handleMouseUp}
                onTouchStart = {handleTouchStart}
                onTouchEnd = {handleTouchEnd}
                onTouchMove = {handleTouchMove}
            />
            <div id = "prediction-area">
                <label>prediction</label>
                <textarea disabled></textarea>
            </div>
            <div className="button-container">
                <button className = "canvas-button clear-button" onClick = {clearCanvas}>Clear</button>
                <button className = "canvas-button predict-button" onClick = {predict}>Predict</button>
            </div>
        </div>
    )
}