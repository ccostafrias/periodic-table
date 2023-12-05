import React from 'react';

export default function ElectronShells(props) {
    const {
        shells,
        onClick,
        classy,
    } = props

    function padArray(array, length, fill) {
        return length > array.length ? Array(length - array.length).fill(fill).concat(array) : array
    }

    function nestedElectrons(array) {
        const [actualValue] = array
        return (
            array.length > 1 ? (
            <div className='electron-shell'>
                {balls(actualValue)}
                {nestedElectrons(array.slice(1))}
            </div>
            ) : (
            <div className='electron-shell'>
                {balls(actualValue)}
                <div className='electron-center' />
            </div>
            )
        )
    }

    function balls(n) {
        return (
            Array(n).fill().map((_, i) => {
                return (
                    <div className='electron-ball-wrapper' style={{
                        transform: `rotate(${360/n*i}deg)`,
                    }}>
                        <div className='electron-ball'></div>
                    </div>
                )
            })
        )
    }

    const electronElements = nestedElectrons(padArray([...shells].reverse(), 8, 0))

    return (
        <>
            <div className={`electron-container ${classy}`} onClick={onClick}>
                {electronElements}
            </div>
        </>
    )
}