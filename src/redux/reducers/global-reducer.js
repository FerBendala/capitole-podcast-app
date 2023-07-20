import { createSlice } from '@reduxjs/toolkit'

const globalSlice = createSlice( {
    name: 'global',
    initialState: {
        error: null,
        expirationDate: '',
        isLoading: true,
    },
    reducers: {
        setError( state, action ) {
            state.error = action.payload
        },
        setExpirationDate( state, action ) {
            state.expirationDate = action.payload
        },
        setIsLoading( state, action ) {
            state.isLoading = action.payload
        },
    },
} )

export const {
    setError,
    setExpirationDate,
    setIsLoading,
} = globalSlice.actions

export default globalSlice.reducer
