import React, { useState, useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"

import { data } from '../data/data'

import AtomicModal from "../components/AtomicModal"
import SearchModal from "../components/SearchModal"
import FilterModal from "../components/FilterModal"
import ElectronModal from "../components/ElectronModal"

import Modal from "../components/Modal"

import Search from "../assets/Search"
import Github from "../assets/Github"

import { getCategoryAbbr } from "../utils"

export default function App() {
    const atomic = data
    const [actualAtom, setActualAtom] = useState(null)
    const [actualCategory, setActualCategory] = useState(null)
    const [scroll, setScroll] = useState('left')
    const [hasShadow, setHasShadow] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams();

    const [filter, setFilter] = useState({
        prop: 'electrons',
        alpha: 'symbol',
        order: 2,
        category: [],
    })

    const [modalsOpen, setModalsOpen] = useState({
        atomic: {
            open: false,
            level: 1,
        },
        search: {
            open: false,
            level: 0,
        },
        filter: {
            open: false,
            level: 2,
        },
        electron: {
            open: false,
            level: 2,
        },
    })

    const [searchInput, setSearchInput] = useState()

    const periodicTable = useRef(null)
    const xBar = useRef(null)
    const yBar = useRef(null)

    const prevAtom = actualAtom && atomic?.find(a => a.number === actualAtom.number - 1)
    const nextAtom  = actualAtom && atomic?.find(a => a.number === actualAtom.number + 1)

    const xBarElements = Array(18).fill().map((_, i) => {
        return (
            <span key={`x-bar-${i}`} className="x-element">{i + 1}</span>
        )
    })

    const yBarElements = Array(10).fill().map((_, i) => {
        return (
            <span key={`y-bar-${i}`} className="y-element">{i + 1}</span>
        )
    })

    const atomicElements = atomic?.map(a => {
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
                key={`atom-${number}`}
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

    const findAtom = (n) => atomic.find(a => a.number === n)

    function handleClickElement(n) {
        const actualAtomValue = findAtom(n)
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
                key={`category-${c}`}
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

    function toggleModal(name) {
    setModalsOpen(prev => ({
        ...prev,
        [name]: {
        ...prev[name],
        open: !prev[name].open
        }
    }));
    }

    function getModal(name) {
        const find = modalsOpen[name]
        if (!find) return

        return find.open
    }

    const isAtomicOpen = getModal('atomic')
    const setIsAtomicOpen = () => toggleModal('atomic')

    const isSearchOpen = getModal('search')
    const setIsSearchOpen = () => toggleModal('search')

    const isFilterOpen = getModal('filter')
    const setIsFilterOpen = () => toggleModal('filter')

    const isElectronOpen = getModal('electron')
    const setIsElectronOpen = () => toggleModal('electron')

    useEffect(() => {
        const openParams = Object.fromEntries([...searchParams])
        
        setModalsOpen(prev => {
            const next = {};

            for (const key in prev) {
                let shouldOpen = Boolean(openParams[key]);

                if (key === 'atomic' && shouldOpen) {
                    const atomNumber = parseInt(openParams[key], 10);
                    const atom = findAtom(atomNumber);
                    console.log(atom);

                    if (atom) {
                        setActualAtom(atom);
                    } else {
                        shouldOpen = false;
                    }
                }

                next[key] = {
                    ...prev[key],
                    open: shouldOpen
                };
            }

            return next;
        });


    }, []);

    useEffect(() => {
        if (Object.values(modalsOpen).every(modal => !modal.open)) {
            setSearchParams({});
            return
        }

        setSearchParams(prevParams => {
            for (const key in modalsOpen) {
                if (modalsOpen[key].open) {
                    if (key === 'atomic' && actualAtom) {
                        prevParams.set('atomic', actualAtom.number)
                        continue
                    }
                    prevParams.set(key, true)
                } else {
                    prevParams.delete(key)
                }
            }
            return prevParams
        })
    }, [modalsOpen])

    // listeners
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

            <Modal
                isOpen={isAtomicOpen} 
                setModalOpen={setIsAtomicOpen}
                level={modalsOpen['atomic'].level}
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
                level={modalsOpen['search'].level}
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
                level={modalsOpen['filter'].level}
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
                level={modalsOpen['electron'].level}
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
                        {atomicElements}
                        <div className="periodic-categories">
                            {categoriesElements}
                        </div>
                    </div>
                </div>
            </main>
        </>
       
    )
}