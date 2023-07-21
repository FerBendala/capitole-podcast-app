import { createSlice } from '@reduxjs/toolkit'

const globalSlice = createSlice( {
    name: 'global',
    initialState: {
        error: null,
        isLoading: true,
    },
    reducers: {
        setError( state, action ) {
            state.error = action.payload
        },
        setIsLoading( state, action ) {
            state.isLoading = action.payload
        },
    },
} )

export const {
    setError,
    setIsLoading,
} = globalSlice.actions

export default globalSlice.reducer
