import { Link } from 'react-router-dom'
import './podcast-info.scss'

const PodcastInfo = ( { podcastInfo = {} } ) => {
    // Get elements from podcastInfo
    const { id, image, title, artist, summary } = podcastInfo

    // Check if the pbject is in the correct format and if it is empty
    const objectIsEmpty = Object.keys( podcastInfo ).length === 0 || !id
    const errorMessage = 'This podcast don\'t have info.'

    // Return error text if there are missing elements or if any element doesn't have an id
    if ( objectIsEmpty ) {
        return <p>{errorMessage}</p>
    }

    return (
        <aside
            key={id}
            className='podcast-info'
            data-testid='podcast-info'
        >
            <Link
                to={`/podcast/${id}`}
                className='podcast-info__image'
            >
                <img src={image} alt={title} title={title} />
            </Link>
            <div className='podcast-info__detail'>
                <Link
                    to={`/podcast/${id}`}
                    className='podcast-info__detail__link'
                >
                    {title}
                </Link>
                <p className='podcast-info__detail__artist'>by {artist}</p>
            </div>
            <div className='podcast-info__description'>
                <h3 className='podcast-info__description__title'>Description:</h3>
                <p className='podcast-info__description__text'>{summary}</p>
            </div>
        </aside>
    )
}

export default PodcastInfo
