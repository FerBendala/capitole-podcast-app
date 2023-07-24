import React from 'react'
import { BrowserRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { formatDate, formatMiliseconds } from '../../utils/time-utils'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import PodcastEpisodes from '../../components/podcast-episodes/podcast-episodes'
import data from '../utils/data.json'

const podcastEpisodesData = data.podcastDetail[1215386938].episodes
const errorMessage = 'This podcast don\'t have episodes'

describe( 'Podcast episodes component', () => {
    let component

    beforeEach( () => {
        component = render(
            <BrowserRouter>
                <PodcastEpisodes podcastEpisodes={podcastEpisodesData} />
            </BrowserRouter>
        )
    } )

    test( 'Renders the episodes list table', () => {
        const [title, date, duration] = [
            podcastEpisodesData[0].title,
            podcastEpisodesData[0].date,
            podcastEpisodesData[0].duration
        ]

        const episodesNumberExists = component.getByText(
            `Episodes: ${podcastEpisodesData.length}`
        )

        const titleExists = component.getByText( title )
        const dateExists = component.getByText( formatDate( date ) )
        const durationExists = component.getByText( formatMiliseconds( duration ) )

        expect( episodesNumberExists ).toBeInTheDocument()
        expect( titleExists ).toBeInTheDocument()
        expect( dateExists ).toBeInTheDocument()
        expect( durationExists ).toBeInTheDocument()
    } )

    test( 'Renders message for undefined podcastInfo', () => {
        component.rerender(
            <BrowserRouter>
                <PodcastEpisodes />
            </BrowserRouter>
        )

        const message = component.getByText( errorMessage )
        expect( message ).toBeInTheDocument()
    } )

    test( 'Renders the correct link to episode page', () => {
        const [id, collectionId, title] = [
            podcastEpisodesData[0].id,
            podcastEpisodesData[0].collectionId,
            podcastEpisodesData[0].title
        ]
        const podcastLink = component.getByText( title )

        expect( podcastLink ).toHaveAttribute( 'href', `/podcast/${collectionId}/episode/${id}` )
    } )

    test( 'Clicking the episode link navigates to correct episode detail page', () => {
        const history = createMemoryHistory()
        component.rerender(
            <Router location={history.location} navigator={history}>
                <PodcastEpisodes podcastEpisodes={podcastEpisodesData} />
            </Router>
        )

        const [id, collectionId, title] = [
            podcastEpisodesData[0].id,
            podcastEpisodesData[0].collectionId,
            podcastEpisodesData[0].title
        ]

        const podcastLink = component.getByText( title )
        fireEvent.click( podcastLink )

        expect( history.location.pathname ).toEqual( `/podcast/${collectionId}/episode/${id}` )
    } )

    test( 'Applies correct CSS classes', () => {
        const podcastEpisodes = component.getByTestId( 'podcast-episodes' )

        expect( podcastEpisodes ).toHaveClass( 'podcast-episodes' )
        expect( podcastEpisodes.firstChild ).toHaveClass( 'podcast-episodes__number' )
        expect( podcastEpisodes.lastChild ).toHaveClass( 'podcast-episodes__table' )
    } )
} )