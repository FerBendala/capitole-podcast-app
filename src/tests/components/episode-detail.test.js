import React from 'react'
import parse from 'html-react-parser'

import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import EpisodeDetail from '../../components/episode-detail/episode-detail'
import data from '../utils/data.json'

// Get specific episode data from json
const episodeDetailData = data.podcastDetail[1215386938].episodes[0]

describe( 'Episode detail component', () => {
    // Declare component
    let component

    beforeEach( () => {
        // Set component before each test
        component = render(
            <EpisodeDetail episodeDetail={episodeDetailData} />
        )
    } )

    test( 'Render the correct episode detail', () => {
        const { title, description } = episodeDetailData
        const titleExists = component.getByText( title )
        const descriptionExists = component.queryByText( parse( description ) )

        // Check if title and description exists into component
        expect( titleExists ).toBeInTheDocument()
        expect( descriptionExists ).toBeInTheDocument()
    } )

    test( 'Render default message when episodeDetail is empty', () => {
        // Render component without content
        component.rerender( <EpisodeDetail /> )

        // Check if error message appears when content isn't loaded
        const defaultMessage = component.getByText( 'Episode not found.' )
        expect( defaultMessage ).toBeInTheDocument()
    } )

    test( 'Render the correct audio source', () => {
        const audioElement = component.getByTestId( 'audio-element' )

        // Check if audio source is in the component
        expect( audioElement ).toBeInTheDocument()
        expect( audioElement ).toHaveAttribute( 'src', episodeDetailData.preview )
    } )

    test( 'Applies correct CSS classes', () => {
        const { title, description } = episodeDetailData

        // Get elements from the rendered component
        const episodeTitle = component.getByText( title )
        const episodeDescription = component.getByText( description )
        const episodeAudio = component.getByTestId( 'audio-element' )
        const episodeArticle = episodeAudio.closest( 'article' )

        // Check if elements have the correct CSS classes
        expect( episodeArticle ).toHaveClass( 'episode-detail' )
        expect( episodeTitle ).toHaveClass( 'episode-detail__title' )
        expect( episodeDescription ).toHaveClass( 'episode-detail__description' )
        expect( episodeAudio ).toHaveClass( 'episode-detail__audio' )
    } )
} )
