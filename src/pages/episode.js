import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import EpisodeDetail from '../components/episode-detail/episode-detail'
import PodcastInfo from '../components/podcast-info/podcast-info'

const Podcast = () => {
    const { podcastId, episodeId } = useParams()

    const podcastDetail = useSelector( ( state ) => state.podcasts.podcastDetail[podcastId] )
    const [episodeDetail, setEpisodeDetail] = useState( {} )

    useEffect( () => {
        const filteredEpisode = podcastDetail.episodes.filter( ( episode ) =>
            Number( episode.id ) === Number( episodeId )
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
