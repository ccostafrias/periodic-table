import React, { useState, useEffect, useRef } from "react"

import { data } from './data'

import Modal from "./Modal"
import SearchIcon from "./assets/SearchIcon"
import Search from "./Search"

import { getCategoryAbbr } from "./utils"

export default function App() {
    const [atomic, setAtomic] = useState(data)
    const [scroll, setScroll] = useState('left')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [actualAtom, setActualAtom] = useState(null)
    const [hasShadow, setHasShadow] = useState(true)
    const periodicTable = useRef(null)

    const prevAtom = actualAtom && atomic?.find(a => a.number === actualAtom.number - 1)
    const nextAtom  = actualAtom && atomic?.find(a => a.number === actualAtom.number + 1)
    const nobleGases = atomic?.filter(a => a.category === 'noble gas')

    console.log(actualAtom)

    const atomicAlements = atomic?.map(a => {
        const column = a.xpos
        const row = a.ypos
        const { symbol, category, name, number } = a
        const categoryAbbr = getCategoryAbbr(category)
        const style = {
            gridColumn: `${column} / span 1`,
            gridRow: `${row} / span 1`
        }

        return (
            <div 
                style={style}
                className={`atom ${categoryAbbr}`}
                key={number}
                onClick={() => handleClickElement(number)}
            >
                <h2 className="atomic-symbol">{symbol}</h2>
                <span className="atomic-name">{name}</span>
                <span className="atomic-number">{number}</span>
            </div>
        )
    })

    function handleScroll(e) {
        const { target } = e
        const maxScrollLeft = target.scrollWidth - target.clientWidth;
        const scrollValue = target.scrollLeft === 0 ? 'left' : (target.scrollLeft === maxScrollLeft ? 'right' : 'middle')
        setScroll(scrollValue)
    }

    function handleClickElement(n) {
        const actualAtomValue = atomic.find(a => a.number === n)
        setActualAtom(actualAtomValue)
        setIsModalOpen(true)
    }

    function getElementScrollbar() {
        const hasHorizontalScrollbar = periodicTable.current.scrollWidth > periodicTable.current.clientWidth
        setHasShadow(hasHorizontalScrollbar)
    }

    useEffect(() => {
        window.addEventListener('resize', getElementScrollbar)
        getElementScrollbar()

        return () => window.removeEventListener('resize', getElementScrollbar)
    }, [])

    return (
        <>
            {isModalOpen && (
                <Modal 
                    setIsModalOpen={setIsModalOpen}
                    actualAtom={actualAtom}
                    setActualAtom={setActualAtom}
                    prevAtom={prevAtom}
                    nextAtom={nextAtom}
                    nobleGases={nobleGases}
                />

                // <ElectronShells 
                //     shells={actualAtom.shells}
                // />

            )}

            {isSearchOpen && (
                <Search 
                    atomic={atomic}
                    setIsSearchOpen={setIsSearchOpen}
                    setIsModalOpen={setIsModalOpen}
                    setActualAtom={setActualAtom}
                />
            )}

            <header className="header-periodic">
                <div className="input-wrapper">
                    <SearchIcon 
                        onClick={() => setIsSearchOpen(true)}
                    />
                </div>
                <h1>Periodic Table</h1>
                <nav></nav>
            </header>
            <main className="main-periodic">
                {hasShadow && (
                    <div className={`shadow ${scroll}`}></div>
                )}
                <div className="periodic-wrapper" onScroll={handleScroll} ref={periodicTable}>
                    {atomic ? (
                        <div className="periodic-table">
                            {atomicAlements}
                        </div>
                    ) : (
                        <h1>Loading...</h1>
                    )}
                </div>
            </main>
        </>
       
    )
}