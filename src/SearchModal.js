import React, { useEffect, useState } from "react"

import { getCategoryAbbr } from "./utils"

import Close from "./assets/Close"
import Search from "./assets/Search"
import Filter from "./assets/Filter"
import Arrow from "./assets/Arrow"

export default function SearchModal(props) {
    const {
        setIsSearchOpen,
        setActualAtom,
        setIsAtomicOpen,
        setIsFilterOpen,
        atomic,
        filter,
        setFilter,
    } = props

    const [searchInput, setSearchInput] = useState()

    const properties = {
        electrons: 'number',
        density: 'density',
        mass: 'atomic_mass',
        electronegativity: 'electronegativity_pauling',
        name: 'name',
        symbol: 'symbol',
    }

    const orderIcons = ['A-Z', 'Z-A', '0-9', '9-0']

    const order = (filter.order % 2 - .5) * -2

    const orderElement = orderIcons[filter.order]

    const higherProp = atomic
        .reduce((prev, curr) => prev[properties[filter.prop]] > curr[properties[filter.prop]] ? prev : curr)
        [properties[filter.prop]]

        console.log(filter.order)
    
    const searchElements = atomic.sort((a, b) => {
        const param = filter.order === 0 || filter.order === 1 ? filter.alpha : filter.prop
        if (a[properties[param]] < b[properties[param]]) {
            return -1 * order
        } 
        if (a[properties[param]] > b[properties[param]]) {
            return 1 * order
        }
        return 0
    })
    .filter(a => {
        return filter.category ? a.category === filter.category : a
    })
    .filter(a => {
        if (!searchInput) return a
        if (a.name.toLowerCase().includes(searchInput)) return a
        if (a.symbol.toLowerCase().includes(searchInput)) return a
        if (a.category.toLowerCase().includes(searchInput)) return a
        if (String(a.number).includes(searchInput)) return a
        if (String(a.atomic_mass).includes(searchInput)) return a
    })
    .map(a => {
        const prop = a[properties[filter.prop]] || 0
        const percentage = 100 * prop / higherProp
        return (
            <div className="atom-search--element" onClick={() => handleClick(a)}>
                <div className={`atom-search--symbol ${getCategoryAbbr(a.category)}`}>
                    <span>{a.symbol}</span>
                </div>
                <div className={`prop-bar ${filter.prop}`} style={{
                    background: `linear-gradient(90deg, var(--color) 0%, var(--color) ${percentage}%, var(--color-dark) ${percentage}%, var(--color-dark) 100%)`
                }}>
                        <div className="prop-bar--content">
                            <span className="atom-search--number">{a.name}</span>
                            <span className="atom-search--name">{prop}</span>
                        </div>
                        <Arrow 
                            className="icon-smaller icon-reverse"
                        />
                </div>
                {/* <div className="prop-bar">
                    <span className="atom-search--mass">{a.atomic_mass} (g/mol)</span>
                </div> */}
            </div>
        )
    })

    function handleClick(a) {
        setActualAtom(a)
        setIsAtomicOpen(true)
    }

    function handleChange(e) {
        const { value } = e.target
        setSearchInput(value)
    }

    function getOutModal(e) {
        const classy = e.target.className
        if (classy === 'modal') {
            setIsSearchOpen(false)
        }
    }

    function backButton(e) {
        const {button} = e
        if (button === 3) {
            setIsSearchOpen(false)
        }
    }

    function changeFilterOrder() {
        setFilter(prevFilter => {
            const newOrder = prevFilter.order + 1
            const max = 3
            return {
                ...prevFilter,
                order: newOrder > max ? 0 : newOrder
            }
        })
    }

    useEffect(() => {
        window.addEventListener('mouseup', backButton)

        return () => {
            window.removeEventListener('mouseup', backButton)
        }
    }, [])

    return (
        <>
            <div 
                className="modal" 
                style={{
                    zIndex: '9998'
                }}
                onClick={getOutModal}
            >
                <div className="modal-container">
                    <div className="modal-header">
                        <div className="input-wrapper">
                            <Search
                                className='searchicon icon-smaller'
                            />
                            <input 
                                type="text" 
                                placeholder="Search: "
                                className="input-search"
                                name="search"
                                id="search"
                                value={searchInput}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>
                        {searchInput && (
                            <Close
                                className='icon-smaller'
                                onClick={() => setSearchInput('')}
                            />
                        )}
                        <Filter 
                            className='icon-smaller'
                            onClick={() => setIsFilterOpen(true)}
                        />
                        <span className="filter-order" onClick={changeFilterOrder}>{orderElement}</span>
                    </div>
                    <div className="modal-content">
                        {searchElements.length > 0 ? (
                            searchElements
                        ) : (
                            <div className="not-found">
                                <span>No results were found :(</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
       
    )
}