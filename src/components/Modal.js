import React, { useEffect, useState, useRef } from "react"

export default function Modal(props) {
    const {
        children,
        isOpen,
        setModalOpen,
        level,
        classy,
    } = props

    const [show, setShow] = useState(isOpen)

    function getOutModal(e) {
        const {button} = e
        if (button !== 3 && button !== 0) return
        const modal = e.target.getAttribute('data-modal')
        if (button === 0 && !modal) return
        const classy = button === 0 ? e.target.className : e.target.closest('.modal').className
        if (classy.includes('modal')) {
            setModalOpen()
        }
    }

    function handleTransitionEnd(e) {
        if (e.propertyName !== 'opacity') return
        if (show === 'close') setShow(null)
    }

    const zIndex = 9999 + level

    useEffect(() => {
        if (isOpen && !show) setShow('open')
        else if (!isOpen && show) setShow('close')
    }, [isOpen])
    
    if (isOpen || show) {
        return (
            <div 
                className={`modal ${show}`}
                style={{
                    zIndex
                }}
                onMouseUp={getOutModal}
                onTransitionEnd={handleTransitionEnd}
                data-modal='true'
            >
                <div className={`modal-container ${classy}`}>
                    {children}
                </div>
            </div>
        )
    }

    return null
}