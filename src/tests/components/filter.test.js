import React from 'react'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import Filter from '../../components/filter/filter'

describe( 'Filter component', () => {
    test( 'Renders the Filter component', () => {
        const setSearchTerm = jest.fn()
        const { getByPlaceholderText, getByText } = render(
            <Filter
                resultsNumber={10}
                searchTerm=""
                setSearchTerm={setSearchTerm}
                text="Search..."
            />
        )
        expect( getByText( '10' ) ).toBeInTheDocument()
        expect( getByPlaceholderText( 'Search...' ) ).toBeInTheDocument()
    } )

    test( 'Updates search term when typing', () => {
        const setSearchTerm = jest.fn()
        const { getByPlaceholderText } = render(
            <Filter
                resultsNumber={10}
                searchTerm=""
                setSearchTerm={setSearchTerm}
                text="Search..."
            />
        )
        const searchInput = getByPlaceholderText( 'Search...' )
        fireEvent.change( searchInput, { target: { value: 'react' } } )
        expect( searchInput.value ).toBe( 'react' )
        expect( setSearchTerm ).toHaveBeenCalledWith( 'react' )
    } )

    test( 'Clears the search term when input text is removed', () => {
        const setSearchTerm = jest.fn()
        const { getByPlaceholderText } = render(
            <Filter
                resultsNumber={10}
                searchTerm="Podcaster"
                setSearchTerm={setSearchTerm}
                text="Search..."
            />
        )

        const searchInput = getByPlaceholderText( 'Search...' )
        fireEvent.change( searchInput, { target: { value: '' } } )

        expect( searchInput.value ).toBe( '' )
        expect( setSearchTerm ).toHaveBeenCalledWith( '' )
    } )

    test( 'Displays the correct number of results', () => {
        const setSearchTerm = jest.fn()
        const { getByText } = render(
            <Filter
                resultsNumber={5}
                searchTerm=""
                setSearchTerm={setSearchTerm}
                text="Search..."
            />
        )
        expect( getByText( '5' ) ).toBeInTheDocument()
    } )

    test( 'Applies correct CSS classes', () => {
        const setSearchTerm = jest.fn()
        const { container } = render(
            <Filter
                resultsNumber={1}
                searchTerm=""
                setSearchTerm={setSearchTerm}
                text="Search..."
            />
        )

        // Expect the CSS classes to change based on the number of results
        expect( container.firstChild ).toHaveClass( 'filter' )
        expect( container.firstChild.firstChild ).toHaveClass( 'filter__results' )
        expect( container.firstChild.lastChild ).toHaveClass( 'filter__input' )
    } )
} )