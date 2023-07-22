import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { setError, setIsLoading } from '../redux/reducers/global-reducer'
import { setPodcastDetail } from '../redux/reducers/podcasts-reducer'

import PodcastInfo from '../components/podcast-info/podcast-info'
import PodcastEpisodes from '../components/podcast-episodes/podcast-episodes'

import { isExpired } from '../utils/utils'
import iTunesService from '../services/index'

const Podcast = () => {
    // Get podcast id from URL params
    const { podcastId } = useParams()
    const dispatch = useDispatch()

    // Get the podcast list, expiration date, and detail from the Redux store
    const { error, isLoading } = useSelector( ( state ) => state.global )

    const { podcastList, expirationDate } = useSelector( ( state ) => state.podcasts )
    const podcastDetail = useSelector( ( state ) => state.podcasts.podcastDetail[podcastId] )


    useEffect( () => {
        console.log( podcastDetail )
        fetchData()
    }, [] )

    // Fetch iTunes api podcast detail data
    const fetchData = async () => {
        if ( !podcastDetail || isExpired( expirationDate ) ) {
            try {
                dispatch( setIsLoading( true ) )

                const response = await iTunesService.getById( podcastId )
                const episodeData = response

                if ( !episodeData || episodeData.length === 0 ) {
                    dispatch( setError( 'No episodes found for this podcast.' ) )
                    dispatch( setIsLoading( false ) )
                    return
                }

                const episodeModelData = podcastModel( episodeData, podcastId )
                // Dispatch the action using the action creator
                dispatch( setPodcastDetail( { podcastId, data: episodeModelData } ) )
                dispatch( setIsLoading( false ) )
            } catch ( error ) {
                dispatch( setIsLoading( false ) )
                dispatch( setError( 'Failed to fetch podcast data.' ) )
            }
        } else {
            dispatch( setIsLoading( false ) )
        }
    }

    // Modeling the podcast data into a more understandable and usable format
    const podcastModel = ( episodeData, id ) => {
        const podcastInfo = podcastList.filter( podcast => podcast.id === id )
        if ( podcastInfo.length === 0 ) {
            return null
        }

        const episodes = episodeData.map( episode => ( {
            id: episode.trackId,
            collectionId: episode.collectionId,
            title: episode.trackName,
            date: episode.releaseDate,
            duration: episode.trackTimeMillis,
            description: episode.description,
            preview: episode.previewUrl,
        } ) )
        episodes.shift() // Remove the first element of episodes (is invalid data)

        // Creating an object with mapped podcast detail data
        const episodesModel = {
            podcastInfo: podcastInfo[0], // Access the first element if it exists
            episodes: episodes
        }

        return episodesModel
    }

    // Log error
    if ( error ) {
        console.error( error )
    }

    if ( isLoading ) {
        return null
    }

    return (
        <section className='main__grid--in-layout'>
            <PodcastInfo podcastInfo={podcastDetail?.podcastInfo} />
            <PodcastEpisodes podcastEpisodes={podcastDetail?.episodes} />
        </section>
    )
}

export default Podcast
