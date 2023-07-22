import { Link } from 'react-router-dom'
import './podcasts-list.scss'

import { useSelector } from 'react-redux'

const PodcastsList = () => {
    const { filteredPodcastList } = useSelector( state => state.podcasts )

    return (
        <section className='podcast-list'>
            {filteredPodcastList.map( ( { id, title, image, artist } ) => (
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
    )
}
export default PodcastsList
