import parse from 'html-react-parser' // to parse html data in description
import './episode-detail.scss'

const EpisodeDetail = ( { episodeDetail = {} } ) => {
    // Get elements from episodeDetail
    const { id, title, description, preview } = episodeDetail

    // Check if the object is in the correct format and if it is empty
    const objectIsEmpty = Object.keys( episodeDetail ).length === 0 || !id
    const errorMessage = 'Episode not found.'

    // Return error text if there are missing elements or if any element doesn't have an id
    if ( objectIsEmpty ) {
        return <p>{errorMessage}</p>
    }

    return (
        <article
            key={id}
            id={id}
            className='episode-detail'
        >
            <h2 className='episode-detail__title'>{title}</h2>
            <p className='episode-detail__description'>{parse( description )}</p>
            <audio
                data-testid="audio-element"
                className='episode-detail__audio'
                src={preview}
                controls
            >
                Your browser does not support the audio element.
            </audio>
        </article>
    )
}

export default EpisodeDetail
