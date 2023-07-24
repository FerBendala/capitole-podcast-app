import parse from 'html-react-parser' // to parse html data in description
import './episode-detail.scss'

const EpisodeDetail = ( { episodeDetail = {} } ) => {
    const { id, title, description, preview } = episodeDetail

    if ( Object.keys( episodeDetail ).length === 0 || !id ) {
        return <p>Episode not found.</p>
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
