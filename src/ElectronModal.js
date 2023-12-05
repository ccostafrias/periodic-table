import React, { useEffect, useState } from "react"

import { getElectronConfiguration, getShell } from "./utils"

import ElectronShells from "./ElectronShells"

export default function ElectronModal(props) {
    const {
        setIsElectronOpen,
        shells,
        actualAtom,
    } = props


    function getOutModal(e) {
        const classy = e.target.className
        if (classy.includes('modal')) {
            setIsElectronOpen(false)
        }
    }

    function backButton(e) {
        const {button} = e
        if (button === 3) {
            setIsElectronOpen(false)
        }
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
                    zIndex: '10000'
                }}
                onClick={getOutModal}
            >
                <div className="modal-container smaller">
                    <div className="modal-inside">
                        <ElectronShells 
                            shells={shells}
                        />
                        <div className="atom-content">
                            <span className="atom-key">Electron Shells:</span>
                            <span>K{getShell(shells[0])} L{getShell(shells[1])} M{getShell(shells[2])} N{getShell(shells[3])} O{getShell(shells[4])} P{getShell(shells[5])} Q{getShell(shells[6])} R{getShell(shells[7])}</span>
                        </div>
                        <div className="atom-content">
                            <span className="atom-key">Electron Configuration: </span>
                            <div>
                                {actualAtom.number > 2 && getElectronConfiguration(actualAtom.electron_configuration_semantic)}
                                {getElectronConfiguration(actualAtom.electron_configuration)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
       
    )
}