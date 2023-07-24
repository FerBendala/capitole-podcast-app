import { BrowserRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'

import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import Podcast from '../../pages/podcast'
import data from '../json/data.json'

// Mock the Redux store
const mockStore = configureStore( [] )

// Use node-fetch in the Node.js environment (tests)
global.fetch = require( 'jest-fetch-mock' )

jest.mock( 'react-router-dom', () => ( {
    ...jest.requireActual( 'react-router-dom' ),
    useParams: jest.fn().mockReturnValue( { podcastId: '1215386938' } ),
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
                podcastList: data.podcastList,
                podcastDetail: data.podcastDetail,
                expirationDate: null,
            },
        } )

        // Mock the API response for iTunesService.getById
        global.fetch.mockResponseOnce( JSON.stringify( data.podcastDetail ) )

        component = render(
            <Provider store={store}>
                <BrowserRouter>
                    <Podcast />
                </BrowserRouter>
            </Provider>
        )
    } )

    afterEach( () => {
        // Restore the original console.error after each test
        console.error = originalConsoleError
    } )

    test( 'render correct content', () => {
        // Info
        expect( screen.getByText( data.podcastDetail[1215386938].podcastInfo.title ) ).toBeInTheDocument()
        expect( screen.getByText( `by ${data.podcastDetail[1215386938].podcastInfo.artist}` ) ).toBeInTheDocument()


        // Episodes
        expect( screen.getByText( data.podcastDetail[1215386938].episodes[0].title ) ).toBeInTheDocument()
    } )

    test( 'fetches data when expirationDate is expired', () => {
        store = mockStore( {
            global: {
                error: null,
                isLoading: false,
            },
            podcasts: {
                podcastDetail: {}, // Set podcastDetail to an empty object
                podcastList: [], // Set podcastList to an empty array
                expirationDate: Date.now() - 1000, // Set expirationDate to a past time (expired)
            },
        } )

        // Render the Podcast component with the mock store and Router
        component.rerender(
            <Provider store={store}>
                <BrowserRouter>
                    <Podcast />
                </BrowserRouter>
            </Provider>
        )

        // Verify that fetchData is called when the expirationDate is expired
        expect( global.fetch ).toHaveBeenCalled()
    } )

    test( 'handles error and logs error message', async () => {
        // Mock console.error to check if the error is logged
        console.error = jest.fn()

        // Mock initial state of the store with an error message
        store = mockStore( {
            global: {
                error: 'This podcast don\'t have info',
                isLoading: false,
            },
            podcasts: {
                podcastDetail: {},
                podcastList: [],
                expirationDate: null,
            },
        } )

        // Render the Podcast component with the mock store and Router
        component.rerender(
            <Provider store={store}>
                <BrowserRouter>
                    <Podcast />
                </BrowserRouter>
            </Provider>
        )

        // Expect the error message to be displayed
        expect( screen.getByText( 'This podcast don\'t have info' ) ).toBeInTheDocument()

        // Expect the error to be logged
        expect( console.error ).toHaveBeenCalledWith( 'This podcast don\'t have info' )
    } )

    test( 'handles loading state correctly', async () => {
        // Mock initial state of the store with an empty podcastDetail and isLoading set to true
        store = mockStore( {
            global: {
                error: null,
                isLoading: true,
            },
            podcasts: {
                podcastDetail: {},
                podcastList: [],
                expirationDate: null,
            },
        } )

        // Render the Podcast component with the mock store and Router
        component.rerender(
            <Provider store={store}>
                <BrowserRouter>
                    <Podcast />
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
} )
