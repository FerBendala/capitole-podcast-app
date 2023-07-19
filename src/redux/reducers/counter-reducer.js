import { createSlice } from '@reduxjs/toolkit'

// Reducer
const counterSlice = createSlice( {
    name: 'counter',
    initialState: {
        clicks: 0,
    },
    reducers: {
        clicked( state, action ) {
            state.clicks = action.payload.clicks
        },
        removeClicks( state ) {
            state.clicks = 0
        }
    },
} )

export const { clicked, removeClicks } = counterSlice.actions

// Thunks
export const sumOne = numberToSum => dispatch => {
    const returnedValue = numberToSum + 1
    dispatch( clicked(
        { clicks: returnedValue }
    ) )
}

export default counterSlice.reducer
