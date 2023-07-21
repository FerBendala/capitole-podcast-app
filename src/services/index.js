// Generate an API endpoint string for the allorigins service
// more info: https://allorigins.win/
const allOrigins = baseUrl =>
    `https://api.allorigins.win/get?url=${encodeURIComponent( baseUrl )}`

// Get all podcast (max 100)
const getAll = async () => {
    try {
        const response = await fetch(
            allOrigins(
                'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'
            )
        )

        const data = await response.json()
        const parseData = JSON.parse( data.contents )
        const entries = parseData.feed.entry

        return entries
    } catch ( error ) {
        return handleApiError( error )
    }
}

// Get episodes of a podcast by author id
// more info: https://performance-partners.apple.com/search-api
const getById = async ( search ) => {
    try {
        const response = await fetch(
            allOrigins(
                `https://itunes.apple.com/lookup?id=${search}&media=podcast&entity=podcastEpisode&limit=100`
            )
        )
        const data = await response.json()
        const parseData = JSON.parse( data.contents )
        const entry = parseData.results

        return entry
    } catch ( error ) {
        return handleApiError( error )
    }
}

// Handle Api errors
const handleApiError = ( error ) => {
    console.error( 'Error fetching data from iTunes API: ', error )
    return { error: true, message: 'Error fetching data from iTunes API' }
}


const iTunesService = { getAll, getById }
export default iTunesService