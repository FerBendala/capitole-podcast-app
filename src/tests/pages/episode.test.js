import { BrowserRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'

import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import Episode from '../../pages/episode'
import data from '../json/data.json'

// Mock the Redux store
const mockStore = configureStore( [] )

// Use node-fetch in the Node.js environment (tests)
global.fetch = require( 'jest-fetch-mock' )

jest.mock( 'react-router-dom', () => ( {
    ...jest.requireActual( 'react-router-dom' ),
    useParams: jest.fn().mockReturnValue( { podcastId: '1215386938', episodeId: 1000621766419 } ),
} ) )

describe( 'Podcast Component', () => {
    let store
    let component
    let originalConsoleError

    beforeEach( () => {
        // Mock console.error to avoid actual logging during test execution
        originalConsoleError = console.error
        console.error = jest.fn()

        store = mockStore( {
            global: {
                error: null,
                isLoading: false,
            },
            podcasts: {
                podcastDetail: data.podcastDetail,
            },
        } )

        component = render(
            <Provider store={store}>
                <BrowserRouter>
                    <Episode />
                </BrowserRouter>
            </Provider>
        )
    } )

    afterEach( () => {
        // Restore the original console.error after each test
        console.error = originalConsoleError
    } )

    test( 'render correct content', () => {
        // Podcast Info
        expect( screen.getByText( data.podcastDetail[1215386938].podcastInfo.title ) ).toBeInTheDocument()
        expect( screen.getByText( `by ${data.podcastDetail[1215386938].podcastInfo.artist}` ) ).toBeInTheDocument()

        // Episode Detail
        expect( screen.getByText( data.podcastDetail[1215386938].episodes[0].title ) ).toBeInTheDocument()
    } )

    test( 'handles loading state correctly', async () => {
        // Mock initial state of the store with isLoading set to true
        store = mockStore( {
            global: {
                isLoading: true,
            },
            podcasts: {
                podcastDetail: data.podcastDetail,
            },
        } )

        component.rerender(
            <Provider store={store}>
                <BrowserRouter>
                    <Episode />
                </BrowserRouter>
            </Provider>
        )

        // Expect loading state to be handled correctly (return null)
        expect( screen.queryByText( 'Loading...' ) ).toBeNull()

        // Wait for loading to complete (setIsLoading(false) in the useEffect hook)
        await waitFor( () => {
            expect( screen.queryByText( 'Loading...' ) ).toBeNull()
        } )
    } )

    test( 'displays podcast and episode details', () => {
        expect( screen.getByText( data.podcastDetail[1215386938].podcastInfo.title ) ).toBeInTheDocument()
        expect( screen.getByText( data.podcastDetail[1215386938].episodes[0].title ) ).toBeInTheDocument()
    } )

    test( 'handles error when episode is not found', () => {
        // Mock initial state of the store with isLoading set to false
        store = mockStore( {
            global: {
                error: null,
                isLoading: false,
            },
            podcasts: {
                podcastDetail: {},
            },
        } )

        // Render the Episode component with a non-existent episode ID
        component.rerender(
            <Provider store={store}>
                <BrowserRouter>
                    <Episode />
                </BrowserRouter>
            </Provider>
        )

        // Expect error message to be displayed when episode is not found
        expect( screen.getByText( 'Episode not found.' ) ).toBeInTheDocument()
    } )
} )
