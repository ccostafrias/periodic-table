import React, { useEffect } from "react"

import FilterModal from "./FilterModal"
import AtomicModal from "./AtomicModal"
import SearchModal from "./SearchModal"

export default function Modals(props) {
    const {
        modalsOpen,
        setModalsOpen,
    } = props

    function getOutModal(e, name) {
        const classy = e.target.className
        if (classy === 'modal') {
            setModalsOpen(prevModalsOpen => {
                return prevModalsOpen.map(m => {
                    return name === m.name ? (
                        {...m, open: false}
                    ) : {...m}
                })
            })
        }
    }

    function backButton(e) {
        const higher = modalsOpen
            .filter(m => m.open)
            .reduce((prev, curr) => prev.level > curr.level ? prev : curr)
        console.log(higher)
        const {button} = e
        if (button === 3) {
            setModalsOpen(prevModalsOpen => {
                return prevModalsOpen.map(m => {
                    return higher.name === m.name ? (
                        {...m, open: false}
                    ) : {...m}
                })
            })
        }
    }

    function findModal(modal, name) {
        return modal.find(m => m.name === name)
    }

    useEffect(() => {
        window.addEventListener('mouseup', backButton)

        return () => {
            window.removeEventListener('mouseup', backButton)
        }
    }, [])

    return (
        <>
            {findModal(modalsOpen, 'atomic').open && (
                <AtomicModal
                    self={findModal(modalsOpen, 'atomic')}
                    getOutModal={getOutModal}
                />
            )}
            {findModal(modalsOpen, 'search').open && (
                <SearchModal
                    self={findModal(modalsOpen, 'search')}
                    getOutModal={getOutModal}
                />
            )}
            {findModal(modalsOpen, 'filter').open && (
                <FilterModal 
                    self={findModal(modalsOpen, 'filter')}
                    getOutModal={getOutModal}
                />
            )}
        </>
       
    )
}