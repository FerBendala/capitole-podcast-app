import React from 'react'
import { BrowserRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import PodcastsList from '../../components/podcasts-list/podcasts-list'

const podcastsListData = [
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
    }
]
const errorMessage = 'No podcasts found. Please try again later or refresh the page.'

describe( 'Podcasts list component', () => {
    test( 'Renders the podcasts list', () => {
        const component = render(
            <BrowserRouter>
                <PodcastsList podcastsList={podcastsListData} />
            </BrowserRouter>
        )

        for ( const item of podcastsListData ) {
            const imageExists = component.getByAltText( item.title )
            const titleExists = component.getByText( item.title )
            const artistExists = component.getByText( `Author: ${item.artist}` )

            expect( imageExists ).toBeInTheDocument()
            expect( titleExists ).toBeInTheDocument()
            expect( artistExists ).toBeInTheDocument()
        }
    } )

    test( 'Renders the correct link to podcast detail', () => {
        const component = render(
            <BrowserRouter>
                <PodcastsList podcastsList={podcastsListData} />
            </BrowserRouter>
        )

        const [title, id] = [podcastsListData[0].title, podcastsListData[0].id]
        const podcastLink = component.getByText( title ).closest( 'a' )

        expect( podcastLink ).toHaveAttribute( 'href', `/podcast/${id}` )
    } )

    test( 'Clicking the podcast link navigates to correct page', () => {
        const history = createMemoryHistory()
        const component = render(
            <Router location={history.location} navigator={history}>
                <PodcastsList podcastsList={podcastsListData} />
            </Router>
        )

        const [title, id] = [podcastsListData[1].title, podcastsListData[1].id]

        const podcastLink = component.getByText( title ).closest( 'a' )
        fireEvent.click( podcastLink )

        expect( history.location.pathname ).toEqual( `/podcast/${id}` )
    } )

    test( 'Renders the reload message when podcastsList is empty', () => {
        const emptyPodcastsList = []
        const component = render(
            <BrowserRouter>
                <PodcastsList podcastsList={emptyPodcastsList} />
            </BrowserRouter>
        )

        const reloadMessage = component.getByText( errorMessage )
        expect( reloadMessage ).toBeInTheDocument()
    } )

    test( 'Renders the reload message when podcastsList is not array', () => {
        const emptyPodcastsList = 'this is not an array'
        const component = render(
            <BrowserRouter>
                <PodcastsList podcastsList={emptyPodcastsList} />
            </BrowserRouter>
        )

        const reloadMessage = component.getByText( errorMessage )
        expect( reloadMessage ).toBeInTheDocument()
    } )

    test( 'Renders the podcasts list with missing properties', () => {
        const podcastsListWithMissingProps = [
            { id: '123', title: 'Podcast 1', image: 'https://image1.png' },
            { id: '456', title: 'Podcast 2', artist: 'Artist 2' },
        ]

        const component = render(
            <BrowserRouter>
                <PodcastsList podcastsList={podcastsListWithMissingProps} />
            </BrowserRouter>
        )

        expect( component.getByAltText( 'Podcast 1' ) ).toBeInTheDocument()
        expect( component.getByText( 'Podcast 1' ) ).toBeInTheDocument()
        expect( component.getByText( 'Author:' ) ).toBeInTheDocument()

        expect( component.getByText( 'Podcast 2' ) ).toBeInTheDocument()
        expect( component.getByText( 'Author: Artist 2' ) ).toBeInTheDocument()
    } )

    test( 'Renders the reload message when podcastsList is not provided', () => {
        const component = render(
            <BrowserRouter>
                <PodcastsList />
            </BrowserRouter>
        )

        const reloadMessage = component.getByText( errorMessage )
        expect( reloadMessage ).toBeInTheDocument()
    } )

    test( 'Applies correct CSS classes', () => {
        const component = render(
            <BrowserRouter>
                <PodcastsList podcastsList={podcastsListData} />
            </BrowserRouter>
        )

        const [title, artist] = [podcastsListData[0].title, podcastsListData[0].artist]

        const podcastArticle = component.getByText( title ).closest( 'article' )
        const podcastLink = component.getByText( title ).closest( 'a' )
        const podcastImage = component.queryByAltText( title )
        const podcastTitle = component.getByText( title )
        const podcastArtist = component.getByText( `Author: ${artist}` )

        expect( podcastArticle ).toHaveClass( 'podcasts-list__item' )
        expect( podcastLink ).toHaveClass( 'podcasts-list__item__link' )
        expect( podcastImage ).toHaveClass( 'link__image' )
        expect( podcastTitle ).toHaveClass( 'link__title' )
        expect( podcastArtist ).toHaveClass( 'link__author' )
    } )
} )