import { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { setIsLoading, setExpirationDate, setError } from '../redux/reducers/global-reducer'
import { setPodcastList, setSearchTerm, setFilteredPodcastList } from '../redux/reducers/home-reducer'

import Filter from '../components/filter/filter'
import PodcastsList from '../components/podcasts-list/podcasts-list'

import { isExpired } from '../utils/utils'
import iTunesService from '../services/index'

const Home = () => {
    const dispatch = useDispatch()
    const { expirationDate, error, isLoading } = useSelector( state => state.global )
    const { filteredPodcastList, podcastList, searchTerm } = useSelector( state => state.home )

    // On load page
    useEffect( () => {
        console.log( isExpired( expirationDate ) )
        fetchData()
    }, [] )

    // Fetch iTunes api podcast list data
    const fetchData = async () => {
        try {
            // If podcastDetail is empty or expirationDate is expired, make a new API call and update Redux state
            if ( podcastList?.length === 0 || isExpired( expirationDate ) ) {
                // Purge all data if expiration date is true
                dispatch( setIsLoading( true ) )

                iTunesService
                    .getAll()
                    .then( ( response ) => {

                        // Updating Redux state with new podcast list data and expiration date
                        const podcastsData = response
                        if ( !podcastsData || podcastsData.length === 0 ) {
                            dispatch( setError( 'No episodes found for this podcast.' ) )
                            return
                        }

                        const podcastsModelData = podcastsListModel( podcastsData )
                        const currentDate = Date.now()

                        dispatch( setFilteredPodcastList( podcastsModelData ) )
                        dispatch( setPodcastList( podcastsModelData ) )

                        dispatch( setExpirationDate( currentDate ) )
                        dispatch( setIsLoading( false ) )
                    } )
            } else {
                dispatch( setIsLoading( false ) )
                dispatch( setFilteredPodcastList( podcastList ) )
            }
        } catch ( error ) {
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
            <PodcastsList podcastsList={filteredPodcastList} />
        </>
    )
}

export default Home
