import { Link } from 'react-router-dom'
import './podcasts-list.scss'

const PodcastsList = ( { podcastsList = [] } ) =>
    <section className='podcast-list'>
        {Array.isArray( podcastsList ) && podcastsList.length > 0
            && podcastsList.map( ( { id, title, image, artist } ) => (
                <article
                    key={id}
                    className='podcast-list__item'
                >
                    <Link
                        to={`/podcast/${id}`}
                        id={id}
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
            ) )
        }
    </section>

export default PodcastsList
