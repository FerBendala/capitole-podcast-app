import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { setIsLoading, setError } from '../redux/reducers/global-reducer'
import { setPodcastList, setSearchTerm, setFilteredPodcastList, setExpirationDate, resetState } from '../redux/reducers/podcasts-reducer'

import { isExpired } from '../utils/utils'
import iTunesService from '../services/index'

const usePodcastsData = () => {
    const { isLoading } = useSelector( state => state.global )
    const { filteredPodcastList, podcastList, searchTerm, expirationDate } = useSelector( state => state.podcasts )

    // to remove
    const podcastStore = useSelector( state => state.podcasts )

    const dispatch = useDispatch()

    console.log( 'store changes:', podcastStore )

    useEffect( () => {
        if ( isExpired( expirationDate ) ) {
            dispatch( resetState() )
            dispatch( setIsLoading( true ) )

            fetchData()
        } else {
            dispatch( setIsLoading( false ) )
            dispatch( setFilteredPodcastList( podcastList ) )
        }

    }, [] )

    const fetchData = async () => {
        iTunesService
            .getAll()
            .then( ( response ) => {
                const podcastsData = response
                if ( !podcastsData || podcastsData.length === 0 ) {
                    dispatch( setError( 'No podcasts found.' ) )
                    return
                }

                const podcastsModelData = podcastsListModel( podcastsData )
                dispatch( setFilteredPodcastList( podcastsModelData ) )
                dispatch( setPodcastList( podcastsModelData ) )

                const currentDate = Date.now()
                dispatch( setExpirationDate( currentDate ) )
                dispatch( setIsLoading( false ) )
            } )
            .catch( () => {
                dispatch( setIsLoading( false ) )
                dispatch( setError( 'Failed to fetch podcast data.' ) )
            } )
    }

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

    const handleSearch = ( data ) => {
        const filteredList = podcastList.filter( ( podcast ) =>
            podcast.title.toLowerCase().includes( data.toLowerCase() )
        )

        dispatch( setFilteredPodcastList( filteredList ) )
        dispatch( setSearchTerm( data ) )
    }

    return {
        isLoading,
        filteredPodcastList,
        searchTerm,
        handleSearch,
    }
}

export default usePodcastsData
