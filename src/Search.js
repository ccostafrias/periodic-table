import React, { useEffect, useState } from "react"

import { getCategoryAbbr } from "./utils"

import Close from "./assets/Close"
import SearchIcon from "./assets/SearchIcon"

export default function Search(props) {
    const {
        setIsSearchOpen,
        setActualAtom,
        setIsModalOpen,
        atomic,
    } = props

    const [searchInput, setSearchInput] = useState()
    
    const atomicFiltered = atomic.sort((a, b) => {
        if (a.symbol < b.symbol) {
            return -1
        } 
        if (a.symbol > b.symbol) {
            return 1
        }
        return 0
    }).filter(a => {
        if (!searchInput) return a
        if (a.name.toLowerCase().includes(searchInput)) return a
        if (a.symbol.toLowerCase().includes(searchInput)) return a
        if (String(a.number).includes(searchInput)) return a
        if (String(a.atomic_mass).includes(searchInput)) return a
    })
    .map(a => {
        return (
            <div className="atom-search--element" onClick={() => handleClick(a)}>
                <div className={`atom-search--symbol ${getCategoryAbbr(a.category)}`}>
                    <span>{a.symbol}</span>
                </div>
                <div className="atom-search--specs">
                    <div className="atom-search--nn">
                        <span className="atom-search--name">{a.name}</span>
                        <span> </span>
                        <span className="atom-search--number">({a.number})</span>
                    </div>
                    <span className="atom-search--mass">{a.atomic_mass} (g/mol)</span>
                </div>
            </div>
        )
    })

    function handleClick(a) {
        setActualAtom(a)
        setIsModalOpen(true)
    }

    function handleChange(e) {
        const { value } = e.target
        setSearchInput(value)
    }

    return (
        <>
            <div className="modal" style={{
                zIndex: '9999'
            }}>
                <div className="modal-container">
                    <div className="modal-header">
                        <div className="input-wrapper">
                            <SearchIcon />
                            <input 
                                type="text" 
                                placeholder="Search: "
                                name="search"
                                id="search"
                                value={searchInput}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>
                        <Close 
                            onClick={() => setIsSearchOpen(false)}
                        />
                    </div>
                    <div className="modal-content">
                        {atomicFiltered}
                    </div>
                </div>
            </div>
        </>
       
    )
}