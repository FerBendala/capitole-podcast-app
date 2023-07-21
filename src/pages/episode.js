import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import EpisodeDetail from '../components/episode-detail/episode-detail'
import PodcastInfo from '../components/podcast-info/podcast-info'

const Podcast = () => {
    // Get podcastId and episodeId from URL params
    // Inizialize state for episode detail
    // Get podcastDeatil from local storage and check if is valid data
    const { podcastId, episodeId } = useParams()
    const podcastDetail = useSelector( ( state ) => state.podcasts.podcastDetail[podcastId] )
    const [episodeDetail, setEpisodeDetail] = useState( {} )

    // Filter episodes to match current episodeId and set to state
    useEffect( () => {
        const filteredEpisode = podcastDetail.episodes.filter( ( episode ) =>
            episode.id === Number( episodeId )
        )
        setEpisodeDetail( filteredEpisode )
    }, [] )

    return (
        <section className='main__grid--in-layout'>
            <PodcastInfo podcastInfo={podcastDetail.podcastInfo} />
            <EpisodeDetail episodeDetail={episodeDetail} />
        </section>
    )
}

export default Podcast
