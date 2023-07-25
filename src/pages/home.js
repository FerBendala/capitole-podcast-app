import { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { setIsLoading, setError } from '../redux/reducers/global-reducer'
import { setPodcastList, setSearchTerm, setFilteredPodcastList, setExpirationDate, resetState } from '../redux/reducers/podcasts-reducer'

import Filter from '../components/filter/filter'
import PodcastsList from '../components/podcasts-list/podcasts-list'

import { podcastsListModel } from '../utils/data-model-utils'
import { isExpired } from '../utils/time-utils'
import iTunesService from '../services/index'

const Home = () => {
    // Get podcastList and some data from redux
    const { error, isLoading } = useSelector( state => state.global )
    const { filteredPodcastList, podcastList, searchTerm, expirationDate } = useSelector( state => state.podcasts )
    const dispatch = useDispatch()

    useEffect( () => {
        // Check if podcastDetail is empty or expirationDate is expired
        const checkDateAndData = podcastList?.length === 0 || isExpired( expirationDate )
        dispatch( setError( null ) )

        if ( checkDateAndData ) fetchData()
        else dispatch( setIsLoading( false ) )
    }, [] )

    // Fetch iTunes api podcast list data
    const fetchData = async () => {
        try {
            // Purge all data and start loading
            dispatch( resetState() )
            dispatch( setIsLoading( true ) )

            // API CALL
            const response = await iTunesService.getAll()
            const podcastsData = response

            // Format and get data
            const podcastsModelData = podcastsListModel( podcastsData )
            dispatch( setFilteredPodcastList( podcastsModelData ) )
            dispatch( setPodcastList( podcastsModelData ) )

            // Set expiration date
            const currentDate = Date.now()
            dispatch( setExpirationDate( currentDate ) )
            dispatch( setIsLoading( false ) )
        } catch ( error ) {
            dispatch( setIsLoading( false ) )
            dispatch( setError( 'Failed to fetch podcast list. Reload the page and try again.' ) )
        }
    }

    // Handle search filter into the filteredPodcastList redux variable
    const handleSearch = ( data ) => {
        const filteredList = podcastList.filter( ( podcast ) =>
            podcast.title.toLowerCase().includes( data.toLowerCase() )
        )

        dispatch( setFilteredPodcastList( filteredList ) )
        dispatch( setSearchTerm( data ) )
    }

    // Return and log error if it occurs
    if ( error ) {
        console.error( error )
        return <p>{error}</p>
    }

    // Return empty content if app is loading
    if ( isLoading ) return null

    return (
        <>
            <Filter
                resultsNumber={filteredPodcastList.length}
                searchTerm={searchTerm}
                setSearchTerm={handleSearch}
                text='Filter by something...'
            />
            <PodcastsList podcastsList={filteredPodcastList} />
        </>
    )
}

export default Home
