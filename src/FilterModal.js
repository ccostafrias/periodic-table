import React, { useEffect, useState } from "react"

import { getCategoryAbbr } from "./utils"

export default function FilterModal(props) {
    const {
        setIsFilterOpen,
        filter,
        setFilter,
        atomic,
    } = props


    function getOutModal(e) {
        const classy = e.target.className
        if (classy.includes('modal')) {
            setIsFilterOpen(false)
        }
    }

    function backButton(e) {
        const {button} = e
        if (button === 3) {
            setIsFilterOpen(false)
        }
    }

    useEffect(() => {
        window.addEventListener('mouseup', backButton)

        return () => {
            window.removeEventListener('mouseup', backButton)
        }
    }, [])

    const properties = ['density', 'electrons', 'mass', 'electronegativity']
    const alphabetic = ['name', 'symbol']

    const propertiesElements = properties.map(p => {
        return (
            <button 
                className={`prop-button ${p === filter.prop ? 'active' : ''}`}
                onClick={() => changeFilter('prop', p)}
            >
                {p}
            </button>
        )
    })

    const alphabeticsElements = alphabetic.map(a => {
        return (
            <button 
                className={`alpha-button ${a === filter.alpha ? 'active' : ''}`}
                onClick={() => changeFilter('alpha', a)}
            >
                {a}
            </button>
        )
    })

    function changeFilter(key, name) {
        if (key === 'category') {

        }
        setFilter(prevFilter => (
            {
                ...prevFilter,
                [key]: key === 'category' && prevFilter.category === name ? null : name,
                // order: key === 'prop' ? 2 : 0,
            }
        ))
    }

    const categories = [...new Set(atomic.sort((a, b) => a.number - b.number).map(a => a.category))]
    const categoriesElements = categories.map(c => {
        return (
            <button 
                className={`filter-categories ${filter.category === c ? getCategoryAbbr(c) : ''}`}
                onClick={() => changeFilter('category', c)}
                >
                {c}
            </button>
        )
    })

    return (
        <>
            <div 
                className="modal" 
                style={{
                    zIndex: '10000'
                }}
                onClick={getOutModal}
            >
                <div className="modal-container smaller">
                    <div className="modal-inside">
                        <div className="filter-wrapper">
                            <span className="filter-label">Properties:</span>
                            <div className="filter-properties">
                                {propertiesElements}
                            </div>
                        </div>
                        <div className="filter-wrapper">
                            <span className="filter-label">Alphabetic order:</span>
                            <div className="filter-properties">
                                {alphabeticsElements}
                            </div>
                        </div>
                        <div className="filter-wrapper">
                            <span className="filter-label">Categories:</span>
                            <div className="filter-properties">
                                {categoriesElements}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
       
    )
}