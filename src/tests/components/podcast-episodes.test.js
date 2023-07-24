import React from 'react'
import { BrowserRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { formatDate, formatMiliseconds } from '../../utils/time-utils'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import PodcastEpisodes from '../../components/podcast-episodes/podcast-episodes'

const podcastEpisodesData = [
    {
        id: 1000607956287,
        collectionId: 1535809341,
        title: 'Episode 616 | \'To Whom It May Concern\'',
        date: '2023-04-08T07:00:00Z',
        duration: 9526000,
        description: 'The JBP begins this weekend’s podcast sending their condolences to Bob Lee, the founder of Cash App, who was killed earlier this week & share their thoughts of the timing of the FedNow announcement just a day later (16:24). The gang then discusses new music including Drake\'s ‘Search & Rescue’ (41:15) & Rae Sremmurd’s project ‘Sremm 4 Life’ (47:47). Also, reactions to the report that Spotify has millions of songs without a single play (1:02:30), Joe & QueenzFlip respond to the hate they’ve been receiving (1:15:30), Chlöe Bailey’s album sold just 10k units first week (1:36:25), + MORE! \n Become a Patron of The Joe Budden Podcast for additional bonus episodes and visual content for all things JBP.: Tap in here www.patreon.com/JoeBudden\n  \n Sleeper Picks:\n Joe | Alex Vaughn (feat. Summer Walker) - “So Be It (Remix)”\n Ice | Don Trip & Starlito - “Gift & a Curse”\n Parks | Curren$y & Jermaine Dupri (feat. T.I.) - “Never Fall Off”\n Melyssa | Kiana Ledé (feat. Ella Mai) - “Jealous”\n QueenzFlip | Lloyd Banks (feat. Method Man) - “101 Razors”',
        preview: 'https://traffic.libsyn.com/secure/jbpod/Joe_Budden_Podcast_616.mp3?dest-id=2422538'
    },
    {
        id: 1000557766210,
        collectionId: 1535809341,
        title: 'Episode 527 | \'Between the Cheats\'',
        date: '2022-04-16T06:30:00Z',
        duration: 10382000,
        description: 'Joe and the guys give an update on the horrific shooting that took place in Brooklyn (21:40) and discuss the A$AP Rocky cheating on Rihanna rumors (41:10). Next, the crew debates if Drake\'s leaked verse was aimed at Pusha T (57:30), DaBaby\'s latest shootout (1:24:00), another installment of \'Part of the Show\' (1:47:25), and MORE!\n Become a Patron of The Joe Budden Podcast for additional bonus episodes and visual content for all things JBP: Tap in here www.patreon.com/JoeBudden\n Sleeper Picks\n Joe | Eli Derby - “Skyfall”\n Ice | Coi Leray - “Overthinking” (Ft. H.E.R.)\n Parks | IDK - “Taco” | Prod. KAYTRANADA\n Ish | Etta Bond - “Teleport”',
        preview: 'https://traffic.libsyn.com/secure/jbpod/Joe_Budden_Podcast_527_19.mp3?dest-id=2422538'
    }
]
const errorMessage = 'This podcast don\'t have episodes'

describe( 'Podcast episodes component', () => {
    test( 'Renders the episodes list table', () => {
        const component = render(
            <BrowserRouter>
                <PodcastEpisodes podcastEpisodes={podcastEpisodesData} />
            </BrowserRouter>
        )

        const [title, date, duration] = [podcastEpisodesData[0].title, podcastEpisodesData[0].date, podcastEpisodesData[0].duration]

        const episodesNumberExists = component.getByText( `Episodes: ${podcastEpisodesData.length}` )
        const titleExists = component.getByText( title )
        const dateExists = component.getByText( formatDate( date ) )
        const durationExists = component.getByText( formatMiliseconds( duration ) )

        expect( episodesNumberExists ).toBeInTheDocument()
        expect( titleExists ).toBeInTheDocument()
        expect( dateExists ).toBeInTheDocument()
        expect( durationExists ).toBeInTheDocument()
    } )

    test( 'Renders message for undefined podcastInfo', () => {
        const component = render(
            <BrowserRouter>
                <PodcastEpisodes />
            </BrowserRouter>
        )

        const message = component.getByText( errorMessage )
        expect( message ).toBeInTheDocument()
    } )

    test( 'Renders the correct link to episode page', () => {
        const component = render(
            <BrowserRouter>
                <PodcastEpisodes podcastEpisodes={podcastEpisodesData} />
            </BrowserRouter>
        )

        const [id, collectionId, title] = [podcastEpisodesData[0].id, podcastEpisodesData[0].collectionId, podcastEpisodesData[0].title]
        const podcastLink = component.getByText( title )

        expect( podcastLink ).toHaveAttribute( 'href', `/podcast/${collectionId}/episode/${id}` )
    } )

    test( 'Clicking the episode link navigates to correct episode detail page', () => {
        const history = createMemoryHistory()
        const component = render(
            <Router location={history.location} navigator={history}>
                <PodcastEpisodes podcastEpisodes={podcastEpisodesData} />
            </Router>
        )

        const [id, collectionId, title] = [podcastEpisodesData[0].id, podcastEpisodesData[0].collectionId, podcastEpisodesData[0].title]

        const podcastLink = component.getByText( title )
        fireEvent.click( podcastLink )

        expect( history.location.pathname ).toEqual( `/podcast/${collectionId}/episode/${id}` )
    } )

    test( 'Applies correct CSS classes', () => {
        const component = render(
            <BrowserRouter>
                <PodcastEpisodes podcastEpisodes={podcastEpisodesData} />
            </BrowserRouter>
        )

        const podcastEpisodes = component.getByTestId( 'podcast-episodes' )

        expect( podcastEpisodes ).toHaveClass( 'podcast-episodes' )
        expect( podcastEpisodes.firstChild ).toHaveClass( 'podcast-episodes__number' )
        expect( podcastEpisodes.lastChild ).toHaveClass( 'podcast-episodes__table' )
    } )
} )