import React from 'react'

import { useSelector } from 'react-redux'
import usePodcastsData from '../hooks/use-podcasts-data'

import Filter from '../components/filter/filter'
import PodcastsList from '../components/podcasts-list/podcasts-list'

const Home = () => {
    const { error } = useSelector( state => state.global )
    const { isLoading, filteredPodcastList, searchTerm, handleSearch } = usePodcastsData()

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
