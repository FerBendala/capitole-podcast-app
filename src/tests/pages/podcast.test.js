import { BrowserRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import Podcast from '../../pages/podcast'
import { formatDate, formatMiliseconds } from '../../utils/time-utils'
import data from '../utils/data.json'

// Select podcast and episode from data json
const podcastId = 1215386938

// Mock the Redux store
const mockStore = configureStore( [] )

// Use node-fetch in the Node.js environment (tests)
global.fetch = require( 'jest-fetch-mock' )

// Mock useParams from react-router-dom
jest.mock( 'react-router-dom', () => ( {
    ...jest.requireActual( 'react-router-dom' ),
    useParams: jest
        .fn()
        .mockReturnValue( {
            podcastId: podcastId
        } ),
} ) )

describe( 'Podcast Component', () => {
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
                podcastList: data.podcastList,
                podcastDetail: data.podcastDetail,
                expirationDate: null,
            },
        } )

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

    test( 'Render correct info content', () => {
        const titleExists = screen.getByText( data.podcastDetail[podcastId].podcastInfo.title )
        const artistExists = screen.getByText( `by ${data.podcastDetail[podcastId].podcastInfo.artist}` )

        // Check if podcast info is rended
        expect( titleExists ).toBeInTheDocument()
        expect( artistExists ).toBeInTheDocument()
    } )

    test( 'Render correct episodes', () => {
        // Set episodes
        const episodes = data.podcastDetail[podcastId].episodes

        // Loop to check if episodes are correct
        for ( const episode of episodes ) {
            // Check if title exists
            const episodeTitleExists = screen.getByText( episode.title )
            expect( episodeTitleExists ).toBeInTheDocument()

            // Format date and duration to check if renders correctly
            const dateExists = screen.getByText( formatDate( episode.date ) )
            const durationExists = screen.getByText( formatMiliseconds( episode.duration ) )
            expect( dateExists ).toBeInTheDocument()
            expect( durationExists ).toBeInTheDocument()
        }
    } )

    test( 'Render correct link episodes', () => {
        // Set episodes
        const episodes = data.podcastDetail[podcastId].episodes

        // Loop to check if episodes are correct
        for ( const episode of episodes ) {
            // Check if link exists
            const episodeTitleExists = screen.getByText( episode.title )
            const episodeLink = `/podcast/${podcastId}/episode/${episode.id}`
            expect( episodeTitleExists ).toHaveAttribute( 'href', episodeLink )
        }
    } )

    test( 'Render correct table header with number of episodes', () => {
        // Get elements from the component
        const titleExists = screen.getByText( 'Title' )
        const dateExists = screen.getByText( 'Date' )
        const durationExists = screen.getByText( 'Duration' )

        const numberOfEpisodes = data.podcastDetail[podcastId].episodes.length
        const espisodesNumberExists = screen.getByText( `Episodes: ${numberOfEpisodes}` )

        // Check if elements exists into component
        expect( titleExists ).toBeInTheDocument()
        expect( dateExists ).toBeInTheDocument()
        expect( durationExists ).toBeInTheDocument()
        expect( espisodesNumberExists ).toBeInTheDocument()
    } )

    test( 'Fetch data when expirationDate is expired', () => {
        // Mock new store with expired expiration date
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

    test( 'Handle error and logs error message', () => {
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

        // Expect the error message to be displayed and the error to be logged
        expect( screen.getByText( 'This podcast don\'t have info' ) ).toBeInTheDocument()
        expect( console.error ).toHaveBeenCalledWith( 'This podcast don\'t have info' )
    } )

    test( 'Not render podcast info while loading', () => {
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

        // Check if podcast info isn't rended
        const titleNotExist = screen.queryByText( data.podcastDetail[podcastId].podcastInfo.title )
        const artistNotExist = screen.queryByText( `by ${data.podcastDetail[podcastId].podcastInfo.artist}` )
        expect( titleNotExist ).toBeNull()
        expect( artistNotExist ).toBeNull()
    } )
} )
