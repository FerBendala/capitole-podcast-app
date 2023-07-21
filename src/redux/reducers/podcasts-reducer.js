import { createSlice } from '@reduxjs/toolkit'

const podcastsSlice = createSlice({
    name: 'podcasts',
    initialState: {
        filteredPodcastList: [],
        podcastList: [],
        podcastDetail: {},
        episodeDetail: {}, // Agregamos esta propiedad para almacenar los detalles del episodio
        searchTerm: '',
    },
    reducers: {
        setFilteredPodcastList(state, action) {
            state.filteredPodcastList = action.payload
        },
        setPodcastList(state, action) {
            state.podcastList = action.payload
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload
        },
        setPodcastDetail(state, action) {
            const { podcastId, data } = action.payload
            state.podcastDetail[podcastId] = data
        },
        setEpisodeDetail(state, action) {
            const { podcastId, episodeId, data } = action.payload
            if (!state.episodeDetail[podcastId]) {
                state.episodeDetail[podcastId] = {}
            }
            state.episodeDetail[podcastId][episodeId] = data
        },
    },
})

export const {
    setFilteredPodcastList,
    setPodcastList,
    setSearchTerm,
    setPodcastDetail,
    setEpisodeDetail, // Añadimos la acción setEpisodeDetail
} = podcastsSlice.actions

export default podcastsSlice.reducer
