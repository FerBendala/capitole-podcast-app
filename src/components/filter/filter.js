import { useEffect, useState } from 'react'
import './filter.scss'

const Filter = ( { resultsNumber, searchTerm, setSearchTerm, text } ) => {
    const [search, setSearch] = useState( searchTerm )

    // Update search term state every time the search variable changes
    useEffect( () => {
        setSearchTerm( search )
    }, [search] )

    // Update search on input
    const handleSearch = ( event ) => {
        setSearch( event.target.value )
    }

    return (
        <div
            className='filter'
            data-testid='filter'
        >
            <span className='filter__results'>{resultsNumber}</span>
            <input
                className='filter__input'
                type='text'
                aria-label='search'
                value={search}
                onChange={handleSearch}
                placeholder={text}
            />
        </div>
    )
}

export default Filter