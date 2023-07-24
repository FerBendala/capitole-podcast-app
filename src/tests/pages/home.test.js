import { BrowserRouter } from 'react-router-dom' // Import BrowserRouter

import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import Home from '../../pages/home'
import data from '../utils/data.json'

// Mock the Redux store
const mockStore = configureStore( [] )

// Use node-fetch in the Node.js environment (tests)
global.fetch = require( 'jest-fetch-mock' )

describe( 'Home Component', () => {
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
                filteredPodcastList: data.filteredPodcastList,
                podcastList: data.podcastList,
                searchTerm: '',
                expirationDate: null,
            },
        } )

        component = render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        )
    } )

    afterEach( () => {
        // Restore the original console.error after each test
        console.error = originalConsoleError
    } )

    test( 'renders without errors', () => {
        expect( screen.getByTestId( 'filter' ) ).toBeInTheDocument()
        expect( screen.getByTestId( 'podcasts-list' ) ).toBeInTheDocument()
    } )

    test( 'renders the podcast list', () => {
        expect( screen.getByText( data.podcastList[0].title ) ).toBeInTheDocument()
        expect( screen.getByText( data.podcastList[1].title ) ).toBeInTheDocument()
    } )

    test( 'renders error message when an error occurs', () => {
        store = mockStore( {
            global: {
                error: 'Failed to fetch podcast list. Reload the page and try again.',
                isLoading: false,
            },
            podcasts: {
                filteredPodcastList: [],
                podcastList: [],
                searchTerm: '',
                expirationDate: null,
            },
        } )

        component.rerender(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        )

        expect(
            screen.getByText( 'Failed to fetch podcast list. Reload the page and try again.' )
        ).toBeInTheDocument()
    } )

    test( 'handles error', () => {
        store = mockStore( {
            global: {
                error: null,
                isLoading: false,
            },
            podcasts: {
                filteredPodcastList: [],
                podcastList: [],
                searchTerm: '',
                expirationDate: null,
            },
        } )

        component.rerender(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        )

        expect(
            screen.getByText( 'No podcasts found. Please try again later or refresh the page.' )
        ).toBeInTheDocument()
    } )

    test( 'displays only one result after search', () => {
        const inputField = screen.getByLabelText( 'search' )
        fireEvent.change( inputField, { target: { value: 'the joe' } } )

        const podcastItems = screen.getAllByTestId( 'podcasts-list' )

        expect( podcastItems.length ).toBe( 1 )
        expect( podcastItems[0] ).toHaveTextContent( 'The Joe Budden Podcast - The Joe Budden Network' )
    } )

    test( 'fetches data when podcastList is empty', () => {
        store = mockStore( {
            global: {
                error: null,
                isLoading: false,
            },
            podcasts: {
                filteredPodcastList: [],
                podcastList: [],
                searchTerm: '',
                expirationDate: null,
            },
        } )

        component.rerender(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        )

        expect( global.fetch ).toHaveBeenCalled()
    } )

    test( 'fetches data when expirationDate is expired', () => {
        // Create a mock store with the initial state
        store = mockStore( {
            global: {
                error: null,
                isLoading: false,
            },
            podcasts: {
                filteredPodcastList: data.filteredPodcastList,
                podcastList: data.podcastList,
                searchTerm: '',
                expirationDate: Date.now() - 1000, // Set expirationDate to a past time (expired)
            },
        } )

        component.rerender(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        )

        // Verify that fetchData is called when the expirationDate is expired
        expect( global.fetch ).toHaveBeenCalled()
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
                    <Home />
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
