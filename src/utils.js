export function getCategoryAbbr(category) {
    return category.split(' ').map(c => c.charAt(0)).join('')
}

export function getElectronConfiguration(config) {
    if (!config) return null
    return (
        <div>
            {config.split(' ').map(c => {
                    const end = c.match(/\d+$/g)
                    const start = c.replace(/\d+$/g, '')
                    const element = end ? (
                        <>
                            <span>{start}</span>
                            <sup>{end}</sup>
                            <span> </span>
                        </>
                    ) : (
                        <>
                            {c}
                            <span> </span>
                        </>
                    )
                    return ( 
                        element
                    )
            })}
        </div>
    )
}

export function getShell(shell) {
    return shell || 0
}