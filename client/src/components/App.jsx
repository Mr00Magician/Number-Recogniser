import React from "react";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import Canvas from "./Canvas";
import "./App.css"

function App() {
    const [data, setData] = useState([{}])

    useEffect(() => {
        fetch("./data").then(
            res => res.json()
        ).then(
            data => {
                setData(data);
                console.log(data);
            }
        ).catch((error) => console.warn('Something went wrong', error))
    }, [])

    return (
        <div>
            <header>
                <NavBar />
            </header>
            <Canvas />
            <h1>{data.name}</h1>
        </div>
    )
}

export default App;