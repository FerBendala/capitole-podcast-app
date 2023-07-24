import { BrowserRouter, Router, Route, MemoryRouter, Routes } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import '@testing-library/jest-dom'
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'

import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import Podcast from '../../pages/podcast'

// Mock the Redux store
const mockStore = configureStore( [] )

// Use node-fetch in the Node.js environment (tests)
global.fetch = require( 'jest-fetch-mock' )

const podcastList = [
    {
        id: 1535809341,
        title: 'The Joe Budden Podcast - The Joe Budden Network',
        image: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/170x170bb.png',
        artist: 'The Joe Budden Network',
    },
    {
        id: 1311004083,
        title: 'Broken Record with Rick Rubin, Malcolm Gladwell, Bruce Headlam and Justin Richmond - Pushkin Industries',
        image: 'https://is4-ssl.mzstatic.com/image/thumb/Podcasts112/v4/7b/12/d5/7b12d5ec-7264-6693-8a8e-e6b414a783c3/mza_10388338206053029687.jpg/170x170bb.png',
        artist: 'Pushkin Industries',
    },
]

const podcastDetail = {
    1096830182: {
        podcastInfo: {
            id: 1096830182,
            title: 'Drink Champs - Interval Presents',
            image: 'https://is2-ssl.mzstatic.com/image/thumb/Podcasts126/v4/1f/ad/c7/1fadc7d4-1e22-beaa-720a-2e2988dc1521/mza_16091018887573148747.jpg/170x170bb.png',
            artist: 'Interval Presents',
            summary: 'Legendary Queens rapper-turned show host N.O.R.E. teams up with Miami hip-hop pioneer DJ EFN for a night of boozy conversation and boisterous storytelling. The hosts and guests engage together in fun, light-hearted conversation - looking back at their paths to success, highlighting their lives, friendships, and iconic moments within their career. In this unfiltered series, drinks are flowing and jokes are rolling - take a seat at the table with N.O.R.E & EFN. You Gotta Relax!'
        },
        episodes: [
            {
                id: 1000621863090,
                collectionId: 1096830182,
                title: 'Episode 373 w/ Large Professor',
                date: '2023-07-21T07:01:00Z',
                duration: 15294000,
                description: 'N.O.R.E. & DJ EFN are the Drink Champs. In this episode the Champs chop it up with the legend himself, Large Professor! Large Pro talks his journey in music, helping create Main Source, working with NAS and much much more! Lots of great stories that you don’t want to miss!!Make some noise for Large Professor!! 💐💐💐🏆🏆🏆\n\n*Subscribe to Patreon NOW for exclusive content, discount codes, M&G’s + more:  🏆*\n\nhttps://www.patreon.com/drinkchamps\n\n*Listen and subscribe at https://www.drinkchamps.com\n\n Follow Drink Champs:\n\nhttps://www.instagram.com/drinkchamps\n\nhttps://www.twitter.com/drinkchamps\n\nhttps://www.facebook.com/drinkchamps\n\nhttps://www.youtube.com/drinkchamps\n\n DJ EFN\n\nhttps://www.crazyhood.com\n\nhttps://www.instagram.com/whoscrazy\n\nhttps://www.twitter.com/djefn\n\nhttps://www.facebook.com/crazyhoodproductions\n\n N.O.R.E.\n\nhttps://www.instagram.com/therealnoreaga\n\nhttps://www.twitter.com/noreaga\nSee omnystudio.com/listener for privacy information.',
                preview: 'https://chrt.fm/track/BE7515/traffic.omny.fm/d/clips/e73c998e-6e60-432f-8610-ae210140c5b1/9ff2dac3-12fd-4561-b512-ae33005f64f5/42d4c9e7-6988-479c-b3ec-b04501418706/audio.mp3?utm_source=Podcast&in_playlist=df6d181a-09ea-4bf2-adc6-ae33005f650d'
            },
            {
                id: 1000621123084,
                collectionId: 1096830182,
                title: 'Episode 372 w/ AKON',
                date: '2023-07-14T07:01:00Z',
                duration: 11844000,
                description: 'N.O.R.E. & DJ EFN are the Drink Champs. In this episode the Champs chop it up with AKON!Drink Champs Alumni and a legend in this game, AKON talks about everything! AKON shares stories of his career, his hairline, creating hit records, earning a Guinness Book of World Record and much much more! Lots of great stories that you don’t want to miss!!Make some noise for AKON!! 💐💐💐🏆🏆🏆\n\n*Subscribe to Patreon NOW for exclusive content, discount codes, M&G’s + more:  🏆*\n\nhttps://www.patreon.com/drinkchamps\n\n*Listen and subscribe at https://www.drinkchamps.com\n\n Follow Drink Champs:\n\nhttps://www.instagram.com/drinkchamps\n\nhttps://www.twitter.com/drinkchamps\n\nhttps://www.facebook.com/drinkchamps\n\nhttps://www.youtube.com/drinkchamps\n\n DJ EFN\n\nhttps://www.crazyhood.com\n\nhttps://www.instagram.com/whoscrazy\n\nhttps://www.twitter.com/djefn\n\nhttps://www.facebook.com/crazyhoodproductions\n\n N.O.R.E.\n\nhttps://www.instagram.com/therealnoreaga\n\nhttps://www.twitter.com/noreaga\nSee omnystudio.com/listener for privacy information.',
                preview: 'https://chrt.fm/track/BE7515/traffic.omny.fm/d/clips/e73c998e-6e60-432f-8610-ae210140c5b1/9ff2dac3-12fd-4561-b512-ae33005f64f5/27d33f73-8a42-4b1f-a712-b03e00d450d0/audio.mp3?utm_source=Podcast&in_playlist=df6d181a-09ea-4bf2-adc6-ae33005f650d'
            }
        ]
    }
}

describe( 'Podcast Component', () => {
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
                podcastList,
                podcastDetail,
                expirationDate: null,
            },
        } )
    } )

    afterEach( () => {
        // Restore the original console.error after each test
        console.error = originalConsoleError
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
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Podcast />
                </BrowserRouter>
            </Provider>
        )

        // Verify that fetchData is called when the expirationDate is expired
        expect( global.fetch ).toHaveBeenCalled()
    } )

    test( 'renders error message when an error occurs', () => {
        // Mock initial state of the store with an empty podcastDetail
        store = mockStore( {
            global: {
                error: 'No episodes found for this podcast.',
                isLoading: false,
            },
            podcasts: {
                podcastDetail: {}, // Set podcastDetail to an empty object
                podcastList: [], // Set podcastList to an empty array
                expirationDate: null, // Set expirationDate to null
            },
        } )

        // Render the Podcast component with the mock store and Router
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Podcast />
                </BrowserRouter>
            </Provider>
        )

        expect( screen.getByText( 'No episodes found for this podcast.' ) ).toBeInTheDocument()
    } )

    test( 'handles error', () => {
        // Mock initial state of the store with an empty podcastDetail
        store = mockStore( {
            global: {
                error: null,
                isLoading: false,
            },
            podcasts: {
                podcastDetail: {}, // Set podcastDetail to an empty object
                podcastList: [], // Set podcastList to an empty array
                expirationDate: null, // Set expirationDate to null
            },
        } )

        // Render the Podcast component with the mock store and Router
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Podcast />
                </BrowserRouter>
            </Provider>
        )

        expect( screen.getByText( 'This podcast don\'t have info' ) ).toBeInTheDocument()
    } )
} )