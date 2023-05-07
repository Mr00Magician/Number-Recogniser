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
            <button className = "canvas-button">Predict</button>
        </div>
    )
}