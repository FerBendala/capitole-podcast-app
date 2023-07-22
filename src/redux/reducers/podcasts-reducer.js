import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    filteredPodcastList: [],
    podcastList: [],
    podcastDetail: {},
    episodeDetail: {},
    expirationDate: null,
    searchTerm: '',
}

const podcastsSlice = createSlice( {
    name: 'podcasts',
    initialState: initialState,
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
        setPodcastDetail( state, action ) {
            const { podcastId, data } = action.payload
            state.podcastDetail[podcastId] = data
        },
        setExpirationDate( state, action ) {
            state.expirationDate = action.payload
        },
        resetState() {
            return initialState
        }
    },
} )

export const {
    setFilteredPodcastList,
    setPodcastList,
    setSearchTerm,
    setPodcastDetail,
    setExpirationDate,
    resetState
} = podcastsSlice.actions


export default podcastsSlice.reducer
