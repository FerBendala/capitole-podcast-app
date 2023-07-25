import { BrowserRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import Episode from '../../pages/episode'
import data from '../utils/data.json'

// Select podcast and episode from data json
const podcastId = 1215386938
const episodeId = 1000621766419

// Mock the Redux store
const mockStore = configureStore( [] )

// Mock useParams from react-router-dom
jest.mock( 'react-router-dom', () => ( {
    ...jest.requireActual( 'react-router-dom' ),
    useParams: jest
        .fn()
        .mockReturnValue( {
            podcastId: podcastId,
            episodeId: episodeId
        } ),
} ) )

describe( 'Podcast Component', () => {
    // Declare store and component
    let store, component

    beforeEach( () => {
        // Set initial store and component before each test
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

    test( 'Render correct content', () => {
        const titleExists = screen.getByText( data.podcastDetail[podcastId].podcastInfo.title )
        const artistExists = screen.getByText( `by ${data.podcastDetail[podcastId].podcastInfo.artist}` )
        const detailTitleExists = screen.getByText( data.podcastDetail[podcastId].episodes[0].title )

        // Check if podcast info is rended
        expect( titleExists ).toBeInTheDocument()
        expect( artistExists ).toBeInTheDocument()
        // Check if episode detail is rended
        expect( detailTitleExists ).toBeInTheDocument()
    } )

    test( 'Render message for undefined podcastInfo', () => {
        // Send empty podcastDetail and rerender component
        store = mockStore( {
            global: { isLoading: false },
            podcasts: { podcastDetail: [] }
        } )

        component.rerender(
            <Provider store={store}>
                <BrowserRouter>
                    <Episode />
                </BrowserRouter>
            </Provider>
        )

        // Check if error message appears when content isn't loaded
        const errorMessageForDetail = screen.queryByText( 'This podcast don\'t have info.' )
        const errorMessageForEpisode = screen.queryByText( 'Episode not found.' )
        expect( errorMessageForDetail ).toBeInTheDocument()
        expect( errorMessageForEpisode ).toBeInTheDocument()
    } )
} )
