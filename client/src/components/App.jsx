import React from "react";
import { useState, useEffect } from "react";

function App() {
    const [data, setData] = useState([{}])

    useEffect(() => {
        fetch("https://number-recogniser.vercel.app/").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            }
        )
    }, [])

    return (
        <div>

        </div>
    )
}

export default App;