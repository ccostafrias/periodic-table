import React from 'react'

export default function Arrow({onClick, className}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" onClick={onClick} className={className} viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M328 112L184 256l144 144"/></svg>
    )
}