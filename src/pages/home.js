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
    const { error, isLoading } = useSelector( state => state.global )
    const { filteredPodcastList, podcastList, searchTerm, expirationDate } = useSelector( state => state.podcasts )

    const dispatch = useDispatch()

    useEffect( () => {
        // Make a new API call if podcastDetail is empty or expirationDate is expired
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

            const podcastsModelData = podcastsListModel( podcastsData )
            dispatch( setFilteredPodcastList( podcastsModelData ) )
            dispatch( setPodcastList( podcastsModelData ) )

            const currentDate = Date.now()
            dispatch( setExpirationDate( currentDate ) )
            dispatch( setIsLoading( false ) )
        } catch ( error ) {
            dispatch( setIsLoading( false ) )
            dispatch( setError( 'Failed to fetch podcast list. Reload the page and try again.' ) )
        }
    }

    // Handle search filter
    const handleSearch = ( data ) => {
        const filteredList = podcastList.filter( ( podcast ) =>
            podcast.title.toLowerCase().includes( data.toLowerCase() )
        )

        dispatch( setFilteredPodcastList( filteredList ) )
        dispatch( setSearchTerm( data ) )
    }

    // Log error
    if ( error ) {
        console.error( error )
        return <p>{error}</p>
    }

    // Early return
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
