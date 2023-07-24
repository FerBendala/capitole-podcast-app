import React from 'react'
import { createMemoryHistory } from 'history'
import parse from 'html-react-parser'

import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import EpisodeDetail from '../../components/episode-detail/episode-detail'
import data from '../json/data.json'

const episodeDetailData = data.podcastDetail[1215386938].episodes[0]

describe( 'Episode detail component', () => {
    let component

    beforeEach( () => {
        component = render(
            <EpisodeDetail episodeDetail={episodeDetailData} />
        )
    } )

    test( 'Renders the correct episode detail', () => {
        const { title, description } = episodeDetailData

        const titleExists = component.getByText( title )
        const descriptionExists = component.queryByText( parse( description ) )

        expect( titleExists ).toBeInTheDocument()
        expect( descriptionExists ).toBeInTheDocument()
    } )

    test( 'Renders the episode detail when navigated to', () => {
        const history = createMemoryHistory()
        const [id, title] = [episodeDetailData.id, episodeDetailData.title]

        history.push( `/episode/${id}` )

        component.rerender(
            <EpisodeDetail episodeDetail={episodeDetailData} />
        )
        const titleExists = component.getByText( title )

        expect( titleExists ).toBeInTheDocument()
    } )

    test( 'Renders default message when episodeDetail is empty', () => {
        component.rerender(
            <EpisodeDetail />
        )

        const defaultMessage = component.getByText(
            'Episode not found.'
        )

        expect( defaultMessage ).toBeInTheDocument()
    } )

    test( 'Renders the correct audio source', () => {
        const audioElement = component.getByTestId( 'audio-element' )

        expect( audioElement ).toBeInTheDocument()
        expect( audioElement ).toHaveAttribute( 'src', episodeDetailData.preview )
    } )

    test( 'Applies correct CSS classes', () => {
        const { title, description } = episodeDetailData

        const episodeTitle = component.getByText( title )
        const episodeDescription = component.getByText( description )
        const episodeAudio = component.getByTestId( 'audio-element' )
        const episodeArticle = episodeAudio.closest( 'article' )

        expect( episodeArticle ).toHaveClass( 'episode-detail' )
        expect( episodeTitle ).toHaveClass( 'episode-detail__title' )
        expect( episodeDescription ).toHaveClass( 'episode-detail__description' )
        expect( episodeAudio ).toHaveClass( 'episode-detail__audio' )
    } )
} )
