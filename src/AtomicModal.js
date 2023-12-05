import React, { useEffect } from "react"

import { getCategoryAbbr, getElectronConfiguration, getShell } from "./utils"

import Arrow from "./assets/Arrow"
import Close from "./assets/Close"
import Link from "./assets/Link"
import Atom from "./assets/Atom"
import Temperature from "./assets/Temperature"
import Radiation from "./assets/Radiation"
import Note from "./assets/Note"
import Gas from "./assets/Gas"
import Liquid from "./assets/Liquid"
import Solid from "./assets/Solid"

import ElectronShells from "./ElectronShells"

export default function AtomicInfo(props) {
    const {
        setIsAtomicOpen,
        setIsElectronOpen,
        actualAtom,
        setActualAtom,
        prevAtom,
        nextAtom,
        filter,
    } = props

    function changeActualAtom(atom) {
        setActualAtom(atom)
    }

    function temperature(kelvin) {
        if (!kelvin) return (<span>----</span>)
        const kelvinElement = (
            <>
                <span>{kelvin.toFixed(2)}<span className="kelvin">K</span></span>
            </>
        )
        const celsius = kelvin - 273.15
        const celsiusElement = (
            <>
                <span>{celsius.toFixed(2)}<span className="celsius">ºC</span></span>
            </>
        )
        const fahrenheit = celsius * 9/5 + 32
        const fahrenheitElement = (
            <>
                <span>{fahrenheit.toFixed(2)}<span className="fahrenheit">ºF</span></span>
            </>
        )

        return (
            <span>
                {celsiusElement} = {fahrenheitElement} = {kelvinElement}
            </span>
        )
    }

    // function lastNobleGas(nobles, n, config) {
    //     const noblesFiltered = nobles.filter(noble => noble.number < n)
    //     if (noblesFiltered.length <= 0) return null
    //     const [lastNoble] = noblesFiltered.slice(-1)
    //     const {symbol, electron_configuration} = lastNoble
    //     const replaced = config.replace(electron_configuration, `[${symbol}]`)
    //     return replaced
    // }

    function getOutModal(e) {
        const classy = e.target.className
        if (classy === 'modal') {
            setIsAtomicOpen(false)
        }
    }

    function backButton(e) {
        const {button} = e
        if (button === 3) {
            setIsAtomicOpen(false)
        }
    }

    const phaseIcon = (() => {
        const phase = actualAtom.phase.toLowerCase()
        if (phase === 'solid') {
            return (
                <div className={`atom-phase-wrapper ${phase}`}>
                    <Solid
                        className="icon-normal icon-nocursor"
                    />
                </div>
            )
        } 
        if (phase === 'liquid') {
            return (
                <div className={`atom-phase-wrapper ${phase}`}>
                    <Liquid
                        className="icon-normal icon-nocursor"
                    />
                </div>
            )
        }
        if (phase === 'gas') {
            return (
                <div className={`atom-phase-wrapper ${phase}`}>
                    <Gas
                        className="icon-normal icon-nocursor"
                    />
                </div>
            )
        }
    })()

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
                    zIndex: '9999'
                }}
                onClick={getOutModal}
            >
                <div className="modal-container">
                    <div className="modal-header">
                        <span>Element Information</span>
                        <Close
                            className='icon-normal'
                            onClick={() => setIsAtomicOpen(false)}
                        />
                    </div>
                    <div className="modal-content">
                        <div className={`atom-header ${getCategoryAbbr(actualAtom.category)}`}>
                            <span className="atom-symbol">{actualAtom.symbol}</span>
                            <span className="atom-name">{actualAtom.name}</span>
                            {/* <span className="atom-mass">{actualAtom.atomic_mass}</span> */}
                            <span className="atom-number">{actualAtom.number}</span>
                            <span className="atom-category">{actualAtom.category}</span>
                            <a href={actualAtom.source} className="atom-link" target="_blank">
                                <Link />
                            </a>
                        </div>
                        <div className="atom-nav">
                            {prevAtom ? (
                                <div className="left">
                                    <span>{prevAtom.name}</span>
                                    <span className={`ball ${getCategoryAbbr(prevAtom.category)}`}></span>
                                    <span>{prevAtom.number}</span>
                                    <Arrow
                                        className="icon-normal arrowicon"
                                        onClick={() => changeActualAtom(prevAtom)}                                       
                                    />
                                </div>
                            ) : (
                                <div></div>
                            )}
                            {nextAtom ? (
                                 <div className="right">
                                    <span>{nextAtom.name}</span>
                                    <span className={`ball ${getCategoryAbbr(nextAtom.category)}`}></span>
                                    <span>{nextAtom.number}</span>
                                    <Arrow
                                        className="icon-normal icon-rotate arrowicon"
                                        onClick={() => changeActualAtom(nextAtom)}
                                    />
                                 </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                        <div className="atom-properties"> 
                            <div className="atom-wrapper">
                                <div className="atom-label general">
                                    <Atom 
                                        className="icon-smaller"
                                    />
                                    <span>General</span>
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Name:</span>
                                    <span>{actualAtom.name}</span>
                                </div>
                                {/* <div className="atom-property">
                                    <span className="atom-key">Category:</span>
                                    <span>{actualAtom.category}</span>
                                </div> */}
                                <div className="atom-property">
                                    <span className="atom-key">Discovered by:</span>
                                    <span>{actualAtom.discovered_by}</span>
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Named by:</span>
                                    <span>{actualAtom.named_by || '-----'}</span>
                                </div>
                                <div className="atom-property horizontal tiny">
                                    <div className="atom-content">
                                        <span className="atom-key">Electron Shells:</span>
                                        <span>K{getShell(actualAtom.shells[0])} L{getShell(actualAtom.shells[1])} M{getShell(actualAtom.shells[2])} N{getShell(actualAtom.shells[3])} O{getShell(actualAtom.shells[4])} P{getShell(actualAtom.shells[5])} Q{getShell(actualAtom.shells[6])} R{getShell(actualAtom.shells[7])}</span>
                                    </div>
                                    <ElectronShells 
                                        onClick={() => setIsElectronOpen(true)}
                                        shells={actualAtom.shells}
                                        classy={'atomic'}
                                    />
                                </div>
                            </div>
                            <div className="atom-wrapper">
                                <div className="atom-label note">
                                    <Note 
                                        className='icon-smaller'
                                    />
                                    <span>Note</span>
                                </div>
                                <div className="atom-property">
                                    <span>{actualAtom.summary}</span>
                                </div>
                            </div>
                            <div className="atom-wrapper">
                                <div className="atom-label properties">
                                    <Temperature
                                        className='icon-smaller'
                                    />
                                    <span>Properties</span>
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Atomic Number:</span>
                                    <span>{actualAtom.number}</span>
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Atomic mass:</span>
                                    <span>{actualAtom.atomic_mass} (g/mol)</span>
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Density</span>
                                    <span>{actualAtom.density} (g/cm³)</span>
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Melting point:</span>
                                    {temperature(actualAtom.melt)}
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Boiling point: </span>
                                    {temperature(actualAtom.boil)}
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Molar Heat: </span>
                                    <span>
                                        {actualAtom.molar_heat ? (
                                            <>
                                                {actualAtom.molar_heat} (J·mol<sup>-1</sup>·K<sup>-1</sup>)
                                            </>
                                        ) : (
                                            <>
                                                ----
                                            </>
                                        )}
                                    </span>
                                </div>
                                <div className="atom-property horizontal">
                                    <div className="atom-content">
                                        <span className="atom-key">Phase: </span>
                                        <span>{actualAtom.phase}</span>
                                    </div>
                                    {phaseIcon}
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Period: </span>
                                    <span>{actualAtom.period}</span>
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Electron Configuration: </span>
                                    <div>
                                        {actualAtom.number > 2 && getElectronConfiguration(actualAtom.electron_configuration_semantic)}
                                        {getElectronConfiguration(actualAtom.electron_configuration)}
                                    </div>
                                </div>
                                {/* {actualAtom.spectral_img && (
                                    <div className="atom-property">
                                        <span className="atom-key">Spectral Emission: </span>
                                        <div className="atom-spectral">
                                            <img src={`https://upload.wikimedia.org/wikipedia/commons/e/e4/${actualAtom.spectral_img.replace('https://en.wikipedia.org/wiki/File:', '')}`} alt="spectral" />
                                        </div>
                                    </div>
                                )} */}
                            </div>
                            <div className="atom-wrapper">
                                <div className="atom-label reactivity">
                                    <Radiation 
                                        className='icon-smaller'
                                    />
                                    <span>Reactivity</span>
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Electronegativity: </span>
                                    <span>{actualAtom.electronegativity_pauling || '-----'}</span>
                                </div>
                                <div className="atom-property">
                                    <span className="atom-key">Electron Affinity: </span>
                                    <span>{actualAtom.electron_affinity} (kj/mol)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
       
    )
}