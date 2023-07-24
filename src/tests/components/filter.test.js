import React from 'react'

import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import Filter from '../../components/filter/filter'

describe( 'Filter component', () => {
    let component, setSearchTerm

    beforeEach( () => {
        setSearchTerm = jest.fn()
        component = render(
            <Filter
                resultsNumber={10}
                searchTerm=""
                setSearchTerm={setSearchTerm}
                text="Search..."
            />
        )
    } )

    test( 'Renders the Filter component', () => {
        const { getByPlaceholderText, getByText } = component

        expect( getByText( '10' ) ).toBeInTheDocument()
        expect( getByPlaceholderText( 'Search...' ) ).toBeInTheDocument()
    } )

    test( 'Updates search term when typing', () => {
        const { getByPlaceholderText } = component
        const searchInput = getByPlaceholderText( 'Search...' )

        fireEvent.change( searchInput, { target: { value: 'react' } } )

        expect( searchInput.value ).toBe( 'react' )
        expect( setSearchTerm ).toHaveBeenCalledWith( 'react' )
    } )

    test( 'Clears the search term when input text is removed', () => {
        const { getByLabelText } = component
        const searchInput = getByLabelText( 'search' )

        fireEvent.change( searchInput, { target: { value: '' } } )

        expect( searchInput.value ).toBe( '' )
        expect( setSearchTerm ).toHaveBeenCalledWith( '' )
    } )

    test( 'Displays the correct number of results', () => {
        component.rerender(
            <Filter
                resultsNumber={5}
                searchTerm=""
                setSearchTerm={setSearchTerm}
                text="Search..."
            />
        )
        expect( component.getByText( '5' ) ).toBeInTheDocument()
    } )

    test( 'Applies correct CSS classes', () => {
        const { container } = component

        expect( container.firstChild ).toHaveClass( 'filter' )
        expect( container.firstChild.firstChild ).toHaveClass( 'filter__results' )
        expect( container.firstChild.lastChild ).toHaveClass( 'filter__input' )
    } )
} )