import React, { useState, useEffect } from "react"


export default function App() {
    const [atomic, setAtomic] = useState()

    useEffect(() => {
        fetch("https://kineticzephyr.onrender.com/periodictable")
            .then(res => res.json())
            .then(data => setAtomic(data.data))

    }, [])

    if (atomic) {
        console.log(atomic.map(a => `${a.xpos} e ${a.ypos}`))
    }


    return (
        <>
            <main></main>
            <div className="periodic-table"></div>
           <h1>Hello, World!</h1>
        </>
       
    )
}