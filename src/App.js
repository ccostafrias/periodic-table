import React, { useState, useEffect, useRef } from "react"
import ReactModal from 'react-modal'

import { data } from './data'

import AtomicModal from "./AtomicModal"
import SearchModal from "./SearchModal"
import FilterModal from "./FilterModal"
import ElectronModal from "./ElectronModal"

import Modal from "./Modal"

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
        order: 2,
        category: [],
    })

    const [modalsOpen, setModalsOpen] = useState([
        {
            name: 'atomic',
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
        {
            name: 'electron',
            open: false,
            level: 2,
        },
    ])

    const [searchInput, setSearchInput] = useState()

    const periodicTable = useRef(null)
    const xBar = useRef(null)
    const yBar = useRef(null)

    const prevAtom = actualAtom && atomic?.find(a => a.number === actualAtom.number - 1)
    const nextAtom  = actualAtom && atomic?.find(a => a.number === actualAtom.number + 1)

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

    function getElementScrollbar() {
        const hasHorizontalScrollbar = periodicTable.current.scrollWidth > periodicTable.current.clientWidth
        setHasShadow(hasHorizontalScrollbar)
    }

    function handleClickElement(n) {
        const actualAtomValue = atomic.find(a => a.number === n)
        setActualAtom(actualAtomValue)
        setIsAtomicOpen()
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
    
    function changeCategories(category) {
        let newCategory
        const hasCategory = filter.category.indexOf(category) !== -1
        if (hasCategory) {
            newCategory = filter.category.filter(c => c !== category)
        } else (
            newCategory = [...filter.category, category]
        )

        setFilter(prevFilter => {
            return {
                ...prevFilter,
                category: newCategory,
                // order: key === 'prop' ? 2 : 0,
            }
        })
    }

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

    function changeModalOpen(name) {
        setModalsOpen(prev => {
            return prev.map(m => {
                return m.name === name ? (
                    {...m, open: !m.open}
                ) : (
                    {...m}
                )
            })
        })
    }

    function getModal(name, prop) {
        const find = modalsOpen.find(m => m.name === name)
        if (!find) return
        return find[prop] 
    }

    const isAtomicOpen = getModal('atomic', 'open')
    const setIsAtomicOpen = () => changeModalOpen('atomic')


    const isSearchOpen = getModal('search', 'open')
    const setIsSearchOpen = () => changeModalOpen('search')

    const isFilterOpen = getModal('filter', 'open')
    const setIsFilterOpen = () => changeModalOpen('filter')

    const isElectronOpen = getModal('electron', 'open')
    const setIsElectronOpen = () => changeModalOpen('electron')

    return (
        <>

            <Modal
                isOpen={isAtomicOpen} 
                setModalOpen={setIsAtomicOpen}
                level={getModal('atomic', 'level')}
                classy='normal'
            >
                <AtomicModal 
                    setIsAtomicOpen={setIsAtomicOpen}
                    setIsElectronOpen={setIsElectronOpen}
                    actualAtom={actualAtom}
                    setActualAtom={setActualAtom}
                    prevAtom={prevAtom}
                    nextAtom={nextAtom}
                    filter={filter}
                />
            </Modal>

            <Modal
                isOpen={isSearchOpen} 
                setModalOpen={setIsSearchOpen}
                level={getModal('search', 'level')}
                classy='normal'
            >
                <SearchModal 
                    atomic={atomic}
                    setIsSearchOpen={setIsSearchOpen}
                    setIsAtomicOpen={setIsAtomicOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    setActualAtom={setActualAtom}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    filter={filter}
                    setFilter={setFilter}
                    changeCategories={changeCategories}
                />
            </Modal>

            <Modal
                isOpen={isFilterOpen} 
                setModalOpen={setIsFilterOpen}
                level={getModal('filter', 'level')}
                classy='smaller'
            >
                <FilterModal 
                    setIsFilterOpen={setIsFilterOpen}
                    filter={filter}
                    setFilter={setFilter}
                    atomic={atomic}
                    changeCategories={changeCategories}
                />
            </Modal>

            <Modal
                isOpen={isElectronOpen} 
                setModalOpen={setIsElectronOpen}
                level={getModal('electron', 'level')}
                classy='smaller'
            >
                <ElectronModal
                    setIsElectronOpen={setIsElectronOpen}
                    actualAtom={actualAtom}
                    shells={actualAtom?.shells}
                />
            </Modal>

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