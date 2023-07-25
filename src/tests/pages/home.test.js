import { BrowserRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import Home from '../../pages/home'
import data from '../utils/data.json'

// Mock the Redux store
const mockStore = configureStore( [] )

// Use node-fetch in the Node.js environment (tests)
global.fetch = require( 'jest-fetch-mock' )

describe( 'Home Component', () => {
    // Declare store, component, and app console.errors
    let store, component, originalConsoleError

    beforeEach( () => {
        // Mock console.error to avoid actual logging during test execution
        originalConsoleError = console.error
        console.error = jest.fn()

        // Set initial store and component before each test
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

    test( 'Render without errors', () => {
        const filterTestId = screen.getByTestId( 'filter' )
        const podcastListTestId = screen.getByTestId( 'podcasts-list' )

        // Check if podcast list test id's are rended
        expect( filterTestId ).toBeInTheDocument()
        expect( podcastListTestId ).toBeInTheDocument()
    } )

    test( 'Render the podcast list', () => {
        const podcastList = data.podcastList

        // Loop to check if podcasts are correct
        for ( const podcast of podcastList ) {
            // Check if title and author exists
            const title = screen.getByText( podcast.title )
            const author = screen.getByText( `Author: ${podcast.artist}` )

            expect( title ).toBeInTheDocument()
            expect( author ).toBeInTheDocument()
        }
    } )

    test( 'Render the correct podcast list links', () => {
        const podcastList = data.podcastList

        // Loop to check if podcasts links are correct
        for ( const podcast of podcastList ) {
            // Check if link exists
            const title = screen.getByText( podcast.title ).closest( 'a' )
            const podcastLink = `/podcast/${podcast.id}`
            expect( title ).toHaveAttribute( 'href', podcastLink )
        }
    } )

    test( 'Render error message when an error occurs', () => {
        // Set error message
        const errorMessage = 'This is an error sample text.'

        // Mock store with new error message and render component
        store = mockStore( {
            global: {
                error: errorMessage,
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

        // Check if error message is into content
        expect( screen.getByText( errorMessage ) ).toBeInTheDocument()
    } )

    test( 'Render message if no podcast found', () => {
        // Mock empty values for podcast list data into store and render component
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

        // Check if error message setted into component exists
        const realComponentErrorMessage = 'No podcasts found. Please try again later or refresh the page.'
        expect( screen.getByText( realComponentErrorMessage ) ).toBeInTheDocument()
    } )

    test( 'Display only one result after search specific podcast *title*', () => {
        const searchTerm = data.podcastList[0].title
        const inputField = screen.getByLabelText( 'search' )
        fireEvent.change( inputField, { target: { value: searchTerm } } )

        const podcastItems = screen.getAllByTestId( 'podcasts-list' )

        expect( podcastItems.length ).toBe( 1 )
        expect( podcastItems[0] ).toHaveTextContent( searchTerm )
    } )

    test( 'Display only one result after search specific podcast *artist*', () => {
        const searchTerm = data.podcastList[0].artist
        const inputField = screen.getByLabelText( 'search' )
        fireEvent.change( inputField, { target: { value: searchTerm } } )

        const podcastItems = screen.getAllByTestId( 'podcasts-list' )

        expect( podcastItems.length ).toBe( 1 )
        expect( podcastItems[0] ).toHaveTextContent( searchTerm )
    } )

    test( 'Fetch data when podcastList is empty', () => {
        // Mock new store with empty and rerender component
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

        // Verify that fetchData is called when podcast list is empty
        expect( global.fetch ).toHaveBeenCalled()
    } )

    test( 'Fetch data when expirationDate is expired', () => {
        // Mock new store with expired expiration date and rerender component
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

        // Verify that fetchData is called when expiration date is expired
        expect( global.fetch ).toHaveBeenCalled()
    } )

    test( 'handles loading state correctly', () => {
        // Mock new store with empty podcastDetail and isLoading set to true
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

        // Rerender component
        component.rerender(
            <Provider store={store}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter>
            </Provider>
        )

        // Check if podcast list test id's aren't rended
        const filterTestId = screen.queryByTestId( 'filter' )
        const podcastListTestId = screen.queryByTestId( 'podcasts-list' )
        expect( filterTestId ).toBeNull()
        expect( podcastListTestId ).toBeNull()
    } )
} )
