import React, { useState, useEffect, useRef } from "react"

import { data } from './data'

import Modal from "./AtomicInfol"
import SearchIcon from "./assets/SearchIcon"
import Search from "./Search"
import Github from "./assets/Github"

import { getCategoryAbbr } from "./utils"

export default function App() {
    const [atomic, setAtomic] = useState(data)
    const [scroll, setScroll] = useState('left')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [actualAtom, setActualAtom] = useState(null)
    const [hasShadow, setHasShadow] = useState(true)

    const periodicTable = useRef(null)
    const xBar = useRef(null)
    const yBar = useRef(null)

    const prevAtom = actualAtom && atomic?.find(a => a.number === actualAtom.number - 1)
    const nextAtom  = actualAtom && atomic?.find(a => a.number === actualAtom.number + 1)
    const nobleGases = atomic?.filter(a => a.category === 'noble gas')

    console.log(actualAtom)

    const xBarElements = Array(18).fill().map((_, i) => {
        return (
            <span className="x-element">{i + 1}</span>
        )
    })

    const yBarElements = Array(10).fill().map((_, i) => {
        return (
            <span className="y-element">{i + 1}</span>
        )
    })

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

    function handleScrollX(e) {
        const { target } = e
        const maxScrollLeft = target.scrollWidth - target.clientWidth;
        const scrollValue = target.scrollLeft === 0 ? 'left' : (target.scrollLeft === maxScrollLeft ? 'right' : 'middle')
        yBar.current.style.left = target.scrollLeft
        setScroll(scrollValue)
    }

    function handleScrollY(e) {
        xBar.current.style.top = document.body.scrollTop
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
        window.addEventListener('scroll', handleScrollY)
        getElementScrollbar()

        return () => {
            window.removeEventListener('resize', getElementScrollbar)
            window.removeEventListener('scroll', handleScrollY)
        }
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
                        className='searchicon'
                        onClick={() => setIsSearchOpen(true)}
                    />
                </div>
                <h1>Periodic Table</h1>
                <a href="https://github.com/ccostafrias" target="_blank">
                    <Github />
                </a>
            </header>
            <div className="overflow-hidden"></div>
            <main className="main-periodic">
                {hasShadow && (
                    <div className={`shadow ${scroll}`}></div>
                )}
                <div className="periodic-wrapper" onScroll={handleScrollX} ref={periodicTable}>
                    <div className="x-bar" ref={xBar}>
                        {xBarElements}
                    </div>
                    <div className="y-bar" ref={yBar}>
                        {yBarElements}
                    </div>
                    <div className="periodic-table">
                        {atomicAlements}
                    </div>
                </div>
            </main>
        </>
       
    )
}