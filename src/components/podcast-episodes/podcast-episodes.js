import { Link } from 'react-router-dom'
import { formatDate, formatMiliseconds } from '../../utils/time-utils'
import './podcast-episodes.scss'

const PodcastEpisodes = ( { podcastEpisodes = [] } ) => {
    // Check if the array is in the correct format and if it is empty
    const arrayIsntEmpty = Array.isArray( podcastEpisodes ) && podcastEpisodes.length > 0
    const errorMessage = 'This podcast don\'t have episodes.'

    return (
        <div
            className='podcast-episodes'
            data-testid='podcast-episodes'
        >
            {arrayIsntEmpty
                ? <>
                    <div className='podcast-episodes__number'>
                        Episodes: {podcastEpisodes.length}
                    </div>
                    <div className='podcast-episodes__table'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Date</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {podcastEpisodes.map( ( { id, collectionId, title, date, duration } ) => (
                                    <tr key={id}>
                                        <td>
                                            <Link
                                                to={`/podcast/${collectionId}/episode/${id}`}
                                                aria-label={`View episode ${title}`}
                                            >
                                                {title}
                                            </Link>
                                        </td>
                                        <td>{formatDate( date )}{ }</td>
                                        <td>{formatMiliseconds( duration )}</td>
                                    </tr>
                                ) )}
                            </tbody>
                        </table>
                    </div>
                </>
                : <p>{errorMessage}</p>
            }
        </div>
    )
}

export default PodcastEpisodes
