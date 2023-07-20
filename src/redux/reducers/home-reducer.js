import { createSlice } from '@reduxjs/toolkit'

const homeSlice = createSlice( {
    name: 'home',
    initialState: {
        filteredPodcastList: [],
        podcastList: [],
        searchTerm: '',
    },
    reducers: {
        setFilteredPodcastList( state, action ) {
            state.filteredPodcastList = action.payload
        },
        setPodcastList( state, action ) {
            state.podcastList = action.payload
        },
        setSearchTerm( state, action ) {
            state.searchTerm = action.payload
        },
    },
} )

export const {
    setFilteredPodcastList,
    setPodcastList,
    setSearchTerm,
} = homeSlice.actions

export default homeSlice.reducer
