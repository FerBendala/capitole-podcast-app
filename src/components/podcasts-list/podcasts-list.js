import { Link } from 'react-router-dom'
import './podcasts-list.scss'

const PodcastsList = ( { podcastsList = [] } ) => {
    // Check if the array is in the correct format and if it is empty
    const arrayIsntEmpty = Array.isArray( podcastsList ) && podcastsList.length > 0
    const errorMessage = 'No podcasts found. Please try again later or refresh the page.'

    return (
        <section
            className='podcasts-list'
            data-testid='podcasts-list'
        >
            {arrayIsntEmpty
                ? podcastsList.map( ( { id, title, image, artist } ) =>
                    <article
                        key={id}
                        className='podcasts-list__item'
                    >
                        <Link
                            to={`/podcast/${id}`}
                            className='podcasts-list__item__link'
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
                ) : <p>{errorMessage}</p>
            }
        </section>
    )
}

export default PodcastsList
