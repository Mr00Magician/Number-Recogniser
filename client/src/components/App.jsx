import React from "react";
import NavBar from "./NavBar";
import Canvas from "./Canvas";
import "./App.css"

function App() {
    return (
        <div>
            <header>
                <NavBar />
            </header>
            <Canvas />
        </div>
    )
}

export default App;