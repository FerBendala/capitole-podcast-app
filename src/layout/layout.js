import { Outlet, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import iconLoader from '../assets/images/icon-loading.svg'
import './layout.scss'

const Layout = () => {
    // Get is loading from redux
    const isLoading = useSelector( ( state ) => state.global.isLoading )

    return (
        <>
            <header className='header'>
                <h1 className='header__title'>
                    <Link to='/' className='header__title__link' >
                        Podcaster
                    </Link>
                </h1>
                {/* Show image if the app is loading some content */}
                {isLoading && (
                    <img
                        src={iconLoader}
                        alt='loader'
                        title='loader'
                        className='header__loader'
                        data-testid='loading-spinner'
                    />
                )}
            </header >
            <main className='main'>
                {/* Load content */}
                <Outlet />
            </main>
        </>
    )
}

export default Layout
