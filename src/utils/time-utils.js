// Check if the given time has passed the maximum duration (24 hours in this case)
export const isExpired = ( timestamp ) => {
    const timePassed = Date.now() - timestamp
    const maxDuration = 24 * 60 * 60 * 1000

    return timePassed > maxDuration
}

// Converts an iTunes API date string to a more readable format.
export const formatDate = ( dateString ) => {
    const date = new Date( dateString )
    const day = date.getDate().toString().padStart( 2, '0' )
    const month = ( date.getMonth() + 1 ).toString().padStart( 2, '0' )
    const year = date.getFullYear().toString()
    return `${day}/${month}/${year}`
}

// Converts a number of milliseconds to a formatted time string.
export const formatMiliseconds = ( milliseconds ) => {
    const totalSeconds = Math.round( milliseconds / 1000 )
    const hours = Math.floor( totalSeconds / 3600 )
    const minutes = Math.floor( ( totalSeconds % 3600 ) / 60 )
    const seconds = totalSeconds % 60

    if ( isNaN( hours ) || isNaN( minutes ) || isNaN( seconds ) ) {
        return '---'
    }

    return `${hours.toString().padStart( 2, '0' )}:${minutes.toString().padStart( 2, '0' )}:${seconds.toString().padStart( 2, '0' )}`
}