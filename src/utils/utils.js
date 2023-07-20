// Check if the given time has passed the maximum duration (24 hours in this case)
export const isExpired = ( time ) => {
    const timePassed = Date.now() - Number( time )
    const maxDuration = 24 * 1000

    return timePassed > maxDuration
}