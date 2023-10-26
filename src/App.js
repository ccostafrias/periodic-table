import React, { useState, useEffect } from "react"


export default function App() {
    const [atomic, setAtomic] = useState()

    useEffect(() => {
        fetch("https://kineticzephyr.onrender.com/periodictable")
            .then(res => res.json())
            .then(data => setAtomic(data.data))

    }, [])

    const atomicAlements = atomic?.map(a => {
        const column = a.xpos
        const row = a.ypos
        const { symbol, category, name, number } = a
        const categoryAbbr = category.split(' ').map(c => c.charAt(0)).join('')
        console.log(categoryAbbr)
        const style = {
            gridColumn: `${column} / span 1`,
            gridRow: `${row} / span 1`
        }

        return (
            <div 
                style={style}
                className={`atom ${categoryAbbr}`}
            >
                <h2 className="atomic-symbol">{symbol}</h2>
                <span className="atomic-name">{name}</span>
                <span className="atomic-number">{number}</span>
            </div>
        )
    })


    return (
        <>
            <header className="header-periodic">
                <h1>Periodic Table</h1>
                <nav></nav>
            </header>
            <main className="main-periodic">
                {atomic ? (
                    <div className="periodic-table">
                        {atomicAlements}
                    </div>
                ) : (
                    <h1>Loading...</h1>
                )}
            </main>
           {/* <h1>Hello, World!</h1> */}
        </>
       
    )
}