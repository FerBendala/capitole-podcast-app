import React from 'react'
import { BrowserRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import PodcastInfo from '../../components/podcast-info/podcast-info'

let podcastInfoData = {
    id: 1535809341,
    title: 'The Joe Budden Podcast - The Joe Budden Network',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/f2/21/fa/f221fabd-017f-5125-633b-f1fe4f39802a/mza_182995249085044287.jpg/170x170bb.png',
    artist: 'The Joe Budden Network',
    summary: 'Tune into Joe Budden and his friends. Follow along the crazy adventures of these very random friends.'
}
const errorMessage = 'This podcast don\'t have info'


describe( 'Podcast info component', () => {
    test( 'Renders the podcast info', () => {
        const component = render(
            <BrowserRouter>
                <PodcastInfo podcastInfo={podcastInfoData} />
            </BrowserRouter>
        )

        const [title, artist, summary] = [podcastInfoData.title, podcastInfoData.artist, podcastInfoData.summary]

        const imageExists = component.getByAltText( title )
        const titleExists = component.getByText( title )
        const artistExists = component.getByText( `by ${artist}` )
        const summaryExists = component.getByText( `${summary}` )

        expect( imageExists ).toBeInTheDocument()
        expect( titleExists ).toBeInTheDocument()
        expect( artistExists ).toBeInTheDocument()
        expect( summaryExists ).toBeInTheDocument()
    } )

    test( 'Renders the correct link to podcast detail page *in image*', () => {
        const component = render(
            <BrowserRouter>
                <PodcastInfo podcastInfo={podcastInfoData} />
            </BrowserRouter>
        )

        const [id, title] = [podcastInfoData.id, podcastInfoData.title]
        const podcastLink = component.getByAltText( title ).closest( 'a' )

        expect( podcastLink ).toHaveAttribute( 'href', `/podcast/${id}` )
    } )

    test( 'Renders message for undefined podcastInfo', () => {
        const component = render(
            <BrowserRouter>
                <PodcastInfo />
            </BrowserRouter>
        )

        const message = component.getByText( errorMessage )
        expect( message ).toBeInTheDocument()
    } )

    test( 'Clicking the podcast link *in image* navigates to correct podcast detail page', () => {
        const history = createMemoryHistory()
        const component = render(
            <Router location={history.location} navigator={history}>
                <PodcastInfo podcastInfo={podcastInfoData} />
            </Router>
        )

        const [id, title] = [podcastInfoData.id, podcastInfoData.title]

        const podcastLink = component.getByAltText( title ).closest( 'a' )
        fireEvent.click( podcastLink )

        expect( history.location.pathname ).toEqual( `/podcast/${id}` )
    } )

    test( 'Renders the correct link to podcast detail page', () => {
        const component = render(
            <BrowserRouter>
                <PodcastInfo podcastInfo={podcastInfoData} />
            </BrowserRouter>
        )

        const [id, title] = [podcastInfoData.id, podcastInfoData.title]
        const podcastLink = component.getByText( title )

        expect( podcastLink ).toHaveAttribute( 'href', `/podcast/${id}` )
    } )

    test( 'Clicking podcast link navigates to correct podcast detail page', () => {
        const history = createMemoryHistory()
        const component = render(
            <Router location={history.location} navigator={history}>
                <PodcastInfo podcastInfo={podcastInfoData} />
            </Router>
        )

        const [id, title] = [podcastInfoData.id, podcastInfoData.title]

        const podcastLink = component.getByText( title )
        fireEvent.click( podcastLink )

        expect( history.location.pathname ).toEqual( `/podcast/${id}` )
    } )

    test( 'Applies correct CSS classes', () => {
        const component = render(
            <BrowserRouter>
                <PodcastInfo podcastInfo={podcastInfoData} />
            </BrowserRouter>
        )

        const podcastInfo = component.getByTestId( 'podcast-info' )
        const podcastTitle = component.getByText( podcastInfoData.title )
        const podcastArtist = component.getByText( `by ${podcastInfoData.artist}` )
        const podcastSummaryTitle = component.getByText( 'Description:' )
        const podcastSummary = component.getByText( podcastInfoData.summary )

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