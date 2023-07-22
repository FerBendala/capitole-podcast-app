import parse from 'html-react-parser' // to parse html data in description
import './episode-detail.scss'

const EpisodeDetail = ( { episodeDetail = [] } ) => {
    return (
        <>
            {Array.isArray( episodeDetail ) && episodeDetail.length > 0
                && episodeDetail.map( ( { id, title, description, preview } ) => (
                    <article
                        key={id}
                        id={id}
                        className='episode-detail'
                    >
                        <h2 className='episode-detail__title'>{title}</h2>
                        <p className='episode-detail__description'>{parse( description )}</p>
                        <audio
                            className='episode-detail__audio'
                            src={preview}
                            controls
                        >
                            Your browser does not support the audio element.
                        </audio>
                    </article>
                ) )
            }
        </ >
    )
}
export default EpisodeDetail
