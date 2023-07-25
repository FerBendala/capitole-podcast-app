import '@testing-library/jest-dom'
import { render, fireEvent } from '@testing-library/react'

import Filter from '../../components/filter/filter'

describe( 'Filter component', () => {
    // Declare component and search term
    let component, setSearchTerm

    beforeEach( () => {
        // Set component and search term before each test
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

    test( 'Render the Filter component', () => {
        const { getByPlaceholderText, getByText } = component

        // Check if the expected elements are in the component
        expect( getByText( '10' ) ).toBeInTheDocument()
        expect( getByPlaceholderText( 'Search...' ) ).toBeInTheDocument()
    } )

    test( 'Update search term when typing', () => {
        const { getByLabelText } = component
        const searchInput = getByLabelText( 'search' )

        // Simulate changing the input value
        fireEvent.change( searchInput, { target: { value: 'podcast' } } )

        // Check if the input value was updated and called
        expect( searchInput.value ).toBe( 'podcast' )
        expect( setSearchTerm ).toHaveBeenCalledWith( 'podcast' )
    } )

    test( 'Clear the search term when input text is removed', () => {
        const { getByLabelText } = component
        const searchInput = getByLabelText( 'search' )

        // Simulate changing the input value
        fireEvent.change( searchInput, { target: { value: 'podcast' } } )

        // Simulate removing the input value
        fireEvent.change( searchInput, { target: { value: '' } } )

        // Check if the input value was cleared and called
        expect( searchInput.value ).toBe( '' )
        expect( setSearchTerm ).toHaveBeenCalledWith( '' )
    } )

    test( 'Display the correct number of results', () => {
        // Rerender the component with different resultsNumber
        component.rerender(
            <Filter
                resultsNumber={5}
                searchTerm=""
                setSearchTerm={setSearchTerm}
                text="Search..."
            />
        )

        // Check if the component displays the correct resultsNumber
        expect( component.getByText( '5' ) ).toBeInTheDocument()
    } )

    test( 'Applie correct CSS classes', () => {
        const { container } = component

        // Check if elements have the correct CSS classes
        expect( container.firstChild ).toHaveClass( 'filter' )
        expect( container.firstChild.firstChild ).toHaveClass( 'filter__results' )
        expect( container.firstChild.lastChild ).toHaveClass( 'filter__input' )
    } )
} )