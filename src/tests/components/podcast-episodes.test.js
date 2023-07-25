import { BrowserRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { formatDate, formatMiliseconds } from '../../utils/time-utils'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import PodcastEpisodes from '../../components/podcast-episodes/podcast-episodes'
import data from '../utils/data.json'

// Get episodes data from json & set error message
const podcastEpisodesData = data.podcastDetail[1215386938].episodes
const errorMessage = 'This podcast don\'t have episodes.'

describe( 'Podcast episodes component', () => {
    // Declare component
    let component

    beforeEach( () => {
        // Set component before each test
        component = render(
            <BrowserRouter>
                <PodcastEpisodes podcastEpisodes={podcastEpisodesData} />
            </BrowserRouter>
        )
    } )

    test( 'Render the episodes list table', () => {
        const [title, date, duration] = [
            podcastEpisodesData[0].title,
            podcastEpisodesData[0].date,
            podcastEpisodesData[0].duration
        ]

        // Get elements from the component
        const episodesNumberExists = component.getByText( `Episodes: ${podcastEpisodesData.length}` )
        const titleExists = component.getByText( title )
        const dateExists = component.getByText( formatDate( date ) )
        const durationExists = component.getByText( formatMiliseconds( duration ) )

        // Check if elements exists into component
        expect( episodesNumberExists ).toBeInTheDocument()
        expect( titleExists ).toBeInTheDocument()
        expect( dateExists ).toBeInTheDocument()
        expect( durationExists ).toBeInTheDocument()
    } )

    test( 'Render message for undefined podcastInfo', () => {
        // Render component without content
        component.rerender(
            <BrowserRouter>
                <PodcastEpisodes />
            </BrowserRouter>
        )

        // Check if error message appears when content isn't loaded
        const message = component.getByText( errorMessage )
        expect( message ).toBeInTheDocument()
    } )

    test( 'Render the correct link to episode page', () => {
        const [id, collectionId, title] = [
            podcastEpisodesData[0].id,
            podcastEpisodesData[0].collectionId,
            podcastEpisodesData[0].title
        ]

        // Get link and check if have correct 'href' attribute
        const podcastLink = component.getByText( title )
        expect( podcastLink ).toHaveAttribute( 'href', `/podcast/${collectionId}/episode/${id}` )
    } )

    test( 'Click the episode link navigates to correct episode detail page', () => {
        // Rerender component with history object to handle navigation
        const history = createMemoryHistory()
        component.rerender(
            <Router location={history.location} navigator={history}>
                <PodcastEpisodes podcastEpisodes={podcastEpisodesData} />
            </Router>
        )

        // Get elements from the rendered component
        const [id, collectionId, title] = [
            podcastEpisodesData[0].id,
            podcastEpisodesData[0].collectionId,
            podcastEpisodesData[0].title
        ]

        // Get episode link element and simulate a click
        const podcastLink = component.getByText( title )
        fireEvent.click( podcastLink )

        // Check if is navigated to the correct episode
        expect( history.location.pathname ).toEqual( `/podcast/${collectionId}/episode/${id}` )
    } )

    test( 'Apply correct CSS classes', () => {
        const podcastEpisodes = component.getByTestId( 'podcast-episodes' )

        // Check if elements have the correct CSS classes
        expect( podcastEpisodes ).toHaveClass( 'podcast-episodes' )
        expect( podcastEpisodes.firstChild ).toHaveClass( 'podcast-episodes__number' )
        expect( podcastEpisodes.lastChild ).toHaveClass( 'podcast-episodes__table' )
    } )
} )