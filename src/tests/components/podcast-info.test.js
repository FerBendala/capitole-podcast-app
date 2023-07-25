import React from 'react'
import { BrowserRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import PodcastInfo from '../../components/podcast-info/podcast-info'
import data from '../utils/data.json'

// Get podcast detail data from json & set error message
const podcastInfoData = data.podcastDetail[1215386938].podcastInfo
const errorMessage = 'This podcast don\'t have info.'


describe( 'Podcast info component', () => {
    // Declare component
    let component

    beforeEach( () => {
        // Set component before each test
        component = render(
            <BrowserRouter>
                <PodcastInfo podcastInfo={podcastInfoData} />
            </BrowserRouter>
        )
    } )

    test( 'Render the podcast info', () => {
        const [title, artist, summary] = [
            podcastInfoData.title,
            podcastInfoData.artist,
            podcastInfoData.summary
        ]

        // Get elements from the component
        const imageExists = component.getByAltText( title )
        const titleExists = component.getByText( title )
        const artistExists = component.getByText( `by ${artist}` )
        const summaryExists = component.getByText( `${summary}` )

        // Check if elements exists into component
        expect( imageExists ).toBeInTheDocument()
        expect( titleExists ).toBeInTheDocument()
        expect( artistExists ).toBeInTheDocument()
        expect( summaryExists ).toBeInTheDocument()
    } )

    test( 'Render the correct link to podcast detail page *in image*', () => {
        const [id, title] = [podcastInfoData.id, podcastInfoData.title]
        const podcastLink = component.getByAltText( title ).closest( 'a' )

        // Get image link and check if it has the correct 'href' attribute.
        expect( podcastLink ).toHaveAttribute( 'href', `/podcast/${id}` )
    } )

    test( 'Render message for undefined podcastInfo', () => {
        // Render component without content
        component.rerender(
            <BrowserRouter>
                <PodcastInfo />
            </BrowserRouter>
        )

        // Check if error message appears when content isn't loaded
        const message = component.getByText( errorMessage )
        expect( message ).toBeInTheDocument()
    } )

    test( 'Render the correct link to podcast detail page', () => {
        const [id, title] = [podcastInfoData.id, podcastInfoData.title]
        const podcastLink = component.getByText( title )

        // Get link and check if have correct 'href' attribute
        expect( podcastLink ).toHaveAttribute( 'href', `/podcast/${id}` )
    } )

    test( 'Click the podcast link *in image* navigates to correct podcast detail page', () => {
        // Rerender component with history object to handle navigation
        const history = createMemoryHistory()
        component.rerender(
            <Router location={history.location} navigator={history}>
                <PodcastInfo podcastInfo={podcastInfoData} />
            </Router>
        )

        // Get elements from the rendered component
        const [id, title] = [podcastInfoData.id, podcastInfoData.title]

        // Get podcast link element and simulate a click
        const podcastLink = component.getByAltText( title ).closest( 'a' )
        fireEvent.click( podcastLink )

        // Check if is navigated to the correct episode
        expect( history.location.pathname ).toEqual( `/podcast/${id}` )
    } )

    test( 'Apply correct CSS classes', () => {
        // Get elements from the component
        const podcastInfo = component.getByTestId( 'podcast-info' )
        const podcastTitle = component.getByText( podcastInfoData.title )
        const podcastArtist = component.getByText( `by ${podcastInfoData.artist}` )
        const podcastSummaryTitle = component.getByText( 'Description:' )
        const podcastSummary = component.getByText( podcastInfoData.summary )


        // Check if elements have the correct CSS classes
        expect( podcastInfo ).toHaveClass( 'podcast-info' )
        expect( podcastInfo.firstChild ).toHaveClass( 'podcast-info__image' )

        expect( podcastTitle.parentElement ).toHaveClass( 'podcast-info__detail' )
        expect( podcastTitle ).toHaveClass( 'podcast-info__detail__link' )
        expect( podcastArtist ).toHaveClass( 'podcast-info__detail__artist' )

        expect( podcastSummaryTitle.parentElement ).toHaveClass( 'podcast-info__description' )
        expect( podcastSummaryTitle ).toHaveClass( 'podcast-info__description__title' )
        expect( podcastSummary ).toHaveClass( 'podcast-info__description__text' )
    } )
} )