import React from 'react'

export default function Search({onClick, className}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" onClick={onClick} className={className} viewBox="0 0 512 512"><path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="64"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="64" d="M338.29 338.29L448 448"/></svg>
    )
}