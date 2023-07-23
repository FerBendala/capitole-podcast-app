import { Link } from 'react-router-dom'
import './podcasts-list.scss'

const PodcastsList = ( { podcastsList = [] } ) => {
    const arrayIsntEmpty = Array.isArray( podcastsList ) && podcastsList.length > 0

    return (
        <section className='podcast-list'>
            {arrayIsntEmpty
                ? podcastsList.map( ( { id, title, image, artist } ) =>
                    <article
                        key={id}
                        className='podcast-list__item'
                    >
                        <Link
                            to={`/podcast/${id}`}
                            className='podcast-list__item__link'
                        >
                            <img
                                src={image}
                                alt={title}
                                title={title}
                                className='link__image'
                            />
                            <p className='link__title'>{title}</p>
                            <p className='link__author'>Author: {artist}</p>
                        </Link>
                    </article>
                ) : <p>No podcasts found. Please try again later or refresh the page.</p>
            }
        </section>
    )
}

export default PodcastsList
