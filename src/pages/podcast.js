import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { setError, setIsLoading } from '../redux/reducers/global-reducer'
import { setPodcastDetail } from '../redux/reducers/podcasts-reducer'

import PodcastInfo from '../components/podcast-info/podcast-info'
import PodcastEpisodes from '../components/podcast-episodes/podcast-episodes'

import { podcastModel } from '../utils/data-model-utils'
import { isExpired } from '../utils/time-utils'
import iTunesService from '../services/index'

const Podcast = () => {
    // Get podcast id from URL params
    const { podcastId } = useParams()

    // Get podcast data and some other data from redux
    const { error, isLoading } = useSelector( ( state ) => state.global )
    const { podcastList, expirationDate } = useSelector( ( state ) => state.podcasts )
    const podcastDetail = useSelector( ( state ) => state.podcasts.podcastDetail[podcastId] )
    const dispatch = useDispatch()

    useEffect( () => {
        // Check if podcastDetail is empty or expirationDate is expired
        const checkDateAndData = !podcastDetail || isExpired( expirationDate )

        if ( checkDateAndData ) fetchData()
        else dispatch( setIsLoading( false ) )
    }, [] )

    // Fetch iTunes api podcast detail data
    const fetchData = async () => {
        try {
            dispatch( setIsLoading( true ) )

            const response = await iTunesService.getById( podcastId )
            const episodeData = response

            if ( !episodeData || episodeData.length === 0 ) {
                dispatch( setError( 'No episodes found for this podcast.' ) )
                dispatch( setIsLoading( false ) )
                return
            }

            const episodeModelData = podcastModel( podcastList, episodeData, podcastId )
            // Dispatch the action using the action creator
            dispatch( setPodcastDetail( { podcastId, data: episodeModelData } ) )
            dispatch( setIsLoading( false ) )
        } catch ( error ) {
            dispatch( setIsLoading( false ) )
            dispatch( setError( 'Failed to fetch podcast data.' ) )
        }
    }

    // Log error
    if ( error ) {
        console.error( error )
        return <p>{error}</p>
    }

    // Return empty content if app is loading
    if ( isLoading ) return null

    return (
        <section className='main__grid'>
            <PodcastInfo podcastInfo={podcastDetail?.podcastInfo} />
            <PodcastEpisodes podcastEpisodes={podcastDetail?.episodes} />
        </section>
    )
}

export default Podcast
