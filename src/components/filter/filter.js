import { useEffect, useState } from 'react'
import './filter.scss'

const Filter = ( { resultsNumber, searchTerm, setSearchTerm, text } ) => {
    const [search, setSearch] = useState( searchTerm )

    useEffect( () => {
        setSearch( '' )
    }, [] )

    const handleSearch = ( event ) => {
        setSearchTerm( event.target.value )
        setSearch( event.target.value )
    }

    return (
        <div className='filter'>
            <span className='filter__results'>{resultsNumber}</span>
            <input
                className='filter__input'
                type='text'
                value={search}
                onChange={handleSearch}
                placeholder={text}
            />
        </div>
    )
}

export default Filter