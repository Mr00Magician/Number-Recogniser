import React from "react";
import { useState, useEffect } from "react";

function App() {
    const [data, setData] = useState([{}])

    useEffect(() => {
        fetch("./data").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            }
        ).catch((error) => console.warn('Something went wrong', error))
    }, [])

    return (
        <div>
            <h1>{data.name}</h1>
        </div>
    )
}

export default App;