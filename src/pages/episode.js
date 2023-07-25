import { useParams } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { setIsLoading } from '../redux/reducers/global-reducer'

import EpisodeDetail from '../components/episode-detail/episode-detail'
import PodcastInfo from '../components/podcast-info/podcast-info'
import { useEffect } from 'react'

const Episode = () => {
    // Get podcast and episode id's from URL params
    const { podcastId, episodeId } = useParams()

    // Get podcast detail data from redux
    const podcastDetail = useSelector( ( state ) => state.podcasts.podcastDetail[podcastId] )
    const dispatch = useDispatch()

    useEffect( () => {
        // Remove is loading state
        dispatch( setIsLoading( false ) )
    }, [] )

    // Set podcast info
    const podcastInfo = podcastDetail?.podcastInfo

    // Search episode into podcastDetail list
    const filteredEpisode = podcastDetail?.episodes?.find( ( episode ) =>
        Number( episode.id ) === Number( episodeId )
    )

    return (
        <section className='main__grid'>
            <PodcastInfo podcastInfo={podcastInfo} />
            <EpisodeDetail episodeDetail={filteredEpisode} />
        </section>
    )
}

export default Episode
