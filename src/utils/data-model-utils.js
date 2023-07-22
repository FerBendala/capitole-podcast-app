// Modeling the podcast list into a more understandable and usable format
export const podcastsListModel = ( podcastData ) => {
    const podcastsModel = podcastData.map( ( podcast ) => ( {
        id: podcast.id.attributes['im:id'],
        title: podcast.title.label,
        image: podcast['im:image'][2].label,
        artist: podcast['im:artist'].label,
        summary: podcast.summary.label,
    } ) )

    return podcastsModel
}

// Modeling the podcast data into a more understandable and usable format
export const podcastModel = ( podcastList, episodeData, id ) => {
    const podcastInfo = podcastList.filter( podcast => podcast.id === id )

    if ( podcastInfo.length === 0 ) return null

    const episodes = episodeData.map( episode => ( {
        id: episode.trackId,
        collectionId: episode.collectionId,
        title: episode.trackName,
        date: episode.releaseDate,
        duration: episode.trackTimeMillis,
        description: episode.description,
        preview: episode.previewUrl,
    } ) )

    // Remove the first element of episodes (is invalid data)
    episodes.shift()

    // Creating an object with mapped podcast detail data
    const episodesModel = {
        podcastInfo: podcastInfo[0], // Access the first element if exists
        episodes: episodes
    }

    return episodesModel
}