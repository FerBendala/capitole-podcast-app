import { BrowserRouter } from 'react-router-dom' // Import BrowserRouter

import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import Home from '../../pages/home'

// Mock the Redux store
const mockStore = configureStore( [] )

// Use node-fetch in the Node.js environment (tests)
global.fetch = require( 'jest-fetch-mock' )

// Data
const podcastList = [
    {
        id: 1535809341,
        title: 'The Joe Budden Podcast - The Joe Budden Network',
        image:
            'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/170x170bb.png',
        artist: 'The Joe Budden Network',
    },
    {
        id: 1311004083,
        title:
            'Broken Record with Rick Rubin, Malcolm Gladwell, Bruce Headlam and Justin Richmond - Pushkin Industries',
        image:
            'https://is4-ssl.mzstatic.com/image/thumb/Podcasts112/v4/7b/12/d5/7b12d5ec-7264-6693-8a8e-e6b414a783c3/mza_10388338206053029687.jpg/170x170bb.png',
        artist: 'Pushkin Industries',
    },
]

describe( 'Home Component', () => {
    let store
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
                filteredPodcastList: podcastList,
                podcastList: podcastList,
                searchTerm: '',
                expirationDate: null,
            },
        } )
    } )

    afterEach( () => {
        // Restore the original console.error after each test
        console.error = originalConsoleError
    } )

    test( 'renders without errors', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        )

        expect( screen.getByTestId( 'filter' ) ).toBeInTheDocument()
        expect( screen.getByTestId( 'podcasts-list' ) ).toBeInTheDocument()
    } )

    test( 'renders the podcast list', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        )

        expect( screen.getByText( podcastList[0].title ) ).toBeInTheDocument()
        expect( screen.getByText( podcastList[1].title ) ).toBeInTheDocument()
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

        render(
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

        render(
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
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        )

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

        render(
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
                filteredPodcastList: podcastList,
                podcastList: podcastList,
                searchTerm: '',
                expirationDate: Date.now() - 1000, // Set expirationDate to a past time (expired)
            },
        } )

        // Render the Home component with the mock store
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        )

        // Verify that fetchData is called when the expirationDate is expired
        expect( global.fetch ).toHaveBeenCalled()
    } )
} )
