import { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { setIsLoading, setError } from '../redux/reducers/global-reducer'
import { setPodcastList, setSearchTerm, setFilteredPodcastList, setExpirationDate, resetState } from '../redux/reducers/podcasts-reducer'

import Filter from '../components/filter/filter'
import PodcastsList from '../components/podcasts-list/podcasts-list'

import { isExpired } from '../utils/utils'
import iTunesService from '../services/index'

const Home = () => {
    const { error, isLoading } = useSelector( state => state.global )
    const { filteredPodcastList, podcastList, searchTerm, expirationDate } = useSelector( state => state.podcasts )

    const dispatch = useDispatch()

    // On load page
    useEffect( () => {
        // If podcastDetail is empty or expirationDate is expired, make a new API call and update Redux state
        if ( podcastList?.length === 0 || isExpired( expirationDate ) ) {
            fetchData()
        } else {
            dispatch( setIsLoading( false ) )
        }
    }, [] )

    // Fetch iTunes api podcast list data
    const fetchData = async () => {
        try {
            // Purge all data if expiration date is true
            dispatch( setIsLoading( true ) )

            dispatch( resetState() )
            const response = await iTunesService.getAll()
            const podcastsData = response

            if ( !podcastsData || podcastsData.length === 0 ) {
                dispatch( setError( 'No episodes found for this podcast.' ) )
                return
            }

            const podcastsModelData = podcastsListModel( podcastsData )
            dispatch( setFilteredPodcastList( podcastsModelData ) )
            dispatch( setPodcastList( podcastsModelData ) )

            const currentDate = Date.now()
            dispatch( setExpirationDate( currentDate ) )
            dispatch( setIsLoading( false ) )
        } catch {
            dispatch( setIsLoading( false ) )
            dispatch( setError( 'Failed to fetch podcast data.' ) )
        }
    }

    // Modeling the podcast list into a more understandable and usable format
    const podcastsListModel = ( podcastData ) => {
        const podcastsModel = podcastData.map( ( podcast ) => ( {
            id: podcast.id.attributes['im:id'],
            title: podcast.title.label,
            image: podcast['im:image'][2].label,
            artist: podcast['im:artist'].label,
            summary: podcast.summary.label,
        } ) )

        return podcastsModel
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
    }

    // Early return
    if ( isLoading ) {
        return null
    }

    return (
        <>
            <Filter
                resultsNumber={filteredPodcastList.length}
                searchTerm={searchTerm}
                setSearchTerm={handleSearch}
                text='Filter by something...'
            />
            <PodcastsList />
        </>
    )
}

export default Home
