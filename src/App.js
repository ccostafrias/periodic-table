import React, { useState, useEffect, useRef } from "react"

import { data } from './data'

import AtomicModal from "./AtomicModal"
import SearchModal from "./SearchModal"
import FilterModal from "./FilterModal"
import ElectronModal from "./ElectronModal"

import Search from "./assets/Search"
import Github from "./assets/Github"

import { getCategoryAbbr } from "./utils"

export default function App() {
    const atomic = data
    const [actualAtom, setActualAtom] = useState(null)
    const [actualCategory, setActualCategory] = useState(null)
    const [scroll, setScroll] = useState('left')
    const [hasShadow, setHasShadow] = useState(true)

    const [filter, setFilter] = useState({
        prop: 'electrons',
        alpha: 'symbol',
        category: null,
        order: 2,
    })

    const [isAtomicOpen, setIsAtomicOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isElectronsOpen, setIsElectronOpen] = useState(false)
    const [modalsOpen, setModalsOpen] = useState([
        {
            namea: 'atomic',
            open: false,
            level: 1,
        },
        {
            name: 'search',
            open: false,
            level: 0,
        },
        {
            name: 'filter',
            open: false,
            level: 2,
        },
    ])

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
        const opacity = actualCategory ? (
            actualCategory === a.category ? 1 : .5
        ) : 1
        const style = {
            gridColumn: `${column} / span 1`,
            gridRow: `${row} / span 1`,
            opacity: opacity,
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
        setIsAtomicOpen(true)
    }

    function getElementScrollbar() {
        const hasHorizontalScrollbar = periodicTable.current.scrollWidth > periodicTable.current.clientWidth
        setHasShadow(hasHorizontalScrollbar)
    }

    function highlightCategory(e) {
        if (e.type.includes('enter')) {
            const { target } = e
            const atributte = target.closest('.category-wrapper').getAttribute('data-category')
            setActualCategory(atributte)
        } else {
            setActualCategory(null)
        }
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

    const categories = [...new Set(atomic.sort((a, b) => a.number - b.number).map(a => a.category))]
    const categoriesElements = categories.map(c => {
        return (
            <div 
                className="category-wrapper"
                data-category={c}
            >
                <div
                    className="category-content"
                    onMouseEnter={highlightCategory}
                    onMouseLeave={highlightCategory}
                >
                    <div className={`category-ball ${getCategoryAbbr(c)}`}></div>
                    <span>{c}</span>
                </div>
            </div>
        )
    })

    return (
        <>
            {isAtomicOpen && (
                <AtomicModal 
                    setIsAtomicOpen={setIsAtomicOpen}
                    setIsElectronOpen={setIsElectronOpen}
                    actualAtom={actualAtom}
                    setActualAtom={setActualAtom}
                    prevAtom={prevAtom}
                    nextAtom={nextAtom}
                    nobleGases={nobleGases}
                    filter={filter}
                />
            )}

            {isSearchOpen && (
                <SearchModal 
                    atomic={atomic}
                    setIsSearchOpen={setIsSearchOpen}
                    setIsAtomicOpen={setIsAtomicOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    setActualAtom={setActualAtom}
                    filter={filter}
                    setFilter={setFilter}
                />
            )}

            {isFilterOpen && (
                <FilterModal 
                    setIsFilterOpen={setIsFilterOpen}
                    filter={filter}
                    setFilter={setFilter}
                    atomic={atomic}
                />
            )}

            {isElectronsOpen && (
                <ElectronModal
                    setIsElectronOpen={setIsElectronOpen}
                    actualAtom={actualAtom}
                    shells={actualAtom.shells}
                />
            )}

            <header className="header-periodic">
                <Search 
                    className='icon-normal'
                    onClick={() => setIsSearchOpen(true)}
                />
                <h1>Periodic Table</h1>
                <a href="https://github.com/ccostafrias" target="_blank">
                    <Github 
                        className='icon-normal'
                    />
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
                        <div className="periodic-categories">
                            {categoriesElements}
                        </div>
                    </div>
                </div>
            </main>
        </>
       
    )
}