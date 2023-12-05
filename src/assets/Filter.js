import React from 'react'

export default function Filter({ className, onClick }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} onClick={onClick} viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M32 144h448M112 256h288M208 368h96"/></svg>
    )
}