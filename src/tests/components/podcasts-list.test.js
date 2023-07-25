import React from 'react'
import { BrowserRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import PodcastsList from '../../components/podcasts-list/podcasts-list'
import data from '../utils/data.json'

// Get podcast list data from json & set error message
const podcastsListData = data.podcastList
const errorMessage = 'No podcasts found. Please try again later or refresh the page.'

describe( 'Podcasts list component', () => {
    // Declare component
    let component

    beforeEach( () => {
        // Set component before each test
        component = render(
            <BrowserRouter>
                <PodcastsList podcastsList={podcastsListData} />
            </BrowserRouter>
        )
    } )

    test( 'Render the podcasts list', () => {
        // Loop to check all elements into component
        for ( const item of podcastsListData ) {
            // Get elements from the component
            const imageExists = component.getByAltText( item.title )
            const titleExists = component.getByText( item.title )
            const artistExists = component.getByText( `Author: ${item.artist}` )

            // Check if elements exists into component
            expect( imageExists ).toBeInTheDocument()
            expect( titleExists ).toBeInTheDocument()
            expect( artistExists ).toBeInTheDocument()
        }
    } )

    test( 'Render the correct link to podcast detail', () => {
        const [title, id] = [podcastsListData[0].title, podcastsListData[0].id]

        // Get link and check if have correct 'href' attribute
        const podcastLink = component.getByText( title ).closest( 'a' )
        expect( podcastLink ).toHaveAttribute( 'href', `/podcast/${id}` )
    } )

    test( 'Click the podcast link navigates to correct page', () => {
        // Rerender component with history object to handle navigation
        const history = createMemoryHistory()
        component.rerender(
            <Router location={history.location} navigator={history}>
                <PodcastsList podcastsList={podcastsListData} />
            </Router>
        )

        // Get elements from the rendered component
        const [title, id] = [podcastsListData[1].title, podcastsListData[1].id]

        // Get podcast link element and simulate a click
        const podcastLink = component.getByText( title ).closest( 'a' )
        fireEvent.click( podcastLink )

        // Check if is navigated to the correct episode
        expect( history.location.pathname ).toEqual( `/podcast/${id}` )
    } )

    test( 'Render the reload message when podcastsList is empty', () => {
        // Render component without content
        const emptyPodcastsList = []
        component.rerender(
            <BrowserRouter>
                <PodcastsList podcastsList={emptyPodcastsList} />
            </BrowserRouter>
        )

        // Check if error message appears when content isn't loaded
        const reloadMessage = component.getByText( errorMessage )
        expect( reloadMessage ).toBeInTheDocument()
    } )

    test( 'Render the reload message when podcastsList is not array', () => {
        // Render component with string instead of array
        const emptyPodcastsList = 'this is not an array'
        component.rerender(
            <BrowserRouter>
                <PodcastsList podcastsList={emptyPodcastsList} />
            </BrowserRouter>
        )

        // Check if error message appears when content isn't loaded
        const reloadMessage = component.getByText( errorMessage )
        expect( reloadMessage ).toBeInTheDocument()
    } )

    test( 'Render the podcasts list with missing properties', () => {
        // Rwply podcast list with missing data
        const podcastsListWithMissingProps = [
            { id: '123', title: 'Podcast 1', image: 'https://image1.png' },
            { id: '456', title: 'Podcast 2', artist: 'Artist 2' },
        ]

        // Rerender component with missing data
        component.rerender(
            <BrowserRouter>
                <PodcastsList podcastsList={podcastsListWithMissingProps} />
            </BrowserRouter>
        )

        // Check if elements exists to view if component are rendering
        expect( component.getByAltText( 'Podcast 1' ) ).toBeInTheDocument()
        expect( component.getByText( 'Podcast 1' ) ).toBeInTheDocument()
        expect( component.getByText( 'Author:' ) ).toBeInTheDocument()
        expect( component.getByText( 'Podcast 2' ) ).toBeInTheDocument()
        expect( component.getByText( 'Author: Artist 2' ) ).toBeInTheDocument()
    } )

    test( 'Apply correct CSS classes', () => {
        const [title, artist] = [podcastsListData[0].title, podcastsListData[0].artist]

        // Get elements from the component
        const podcastArticle = component.getByText( title ).closest( 'article' )
        const podcastLink = component.getByText( title ).closest( 'a' )
        const podcastImage = component.queryByAltText( title )
        const podcastTitle = component.getByText( title )
        const podcastArtist = component.getByText( `Author: ${artist}` )

        // Check if elements have the correct CSS classes
        expect( podcastArticle ).toHaveClass( 'podcasts-list__item' )
        expect( podcastLink ).toHaveClass( 'podcasts-list__item__link' )
        expect( podcastImage ).toHaveClass( 'link__image' )
        expect( podcastTitle ).toHaveClass( 'link__title' )
        expect( podcastArtist ).toHaveClass( 'link__author' )
    } )
} )