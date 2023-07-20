import { Outlet, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setIsLoading } from '../redux/reducers/global-reducer'

import iconLoader from '../assets/images/icon-loading.svg'
import './layout.scss'

const Layout = () => {
    // Get is loading from redux
    const isLoading = useSelector( ( state ) => state.global.isLoading )
    const dispatch = useDispatch()

    return (
        <>
            <header className='header'>
                <h1 className='header__title'>
                    <Link
                        to='/'
                        className='header__title__link'
                        onClick={() => dispatch( setIsLoading( false ) )}
                    >
                        Podcaster
                    </Link>
                </h1>
                {isLoading && (
                    <img
                        src={iconLoader}
                        alt='loader'
                        title='loader'
                        className='header__loader'
                    />
                )}
            </header>
            <main className='main'>
                <Outlet />
            </main>
        </>
    )
}

export default Layout
