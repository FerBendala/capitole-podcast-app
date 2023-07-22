import { Outlet, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import iconLoader from '../assets/images/icon-loading.svg'
import './layout.scss'

const Layout = () => {
    const isLoading = useSelector( ( state ) => state.global.isLoading )

    return (
        <>
            <header className='header'>
                <h1 className='header__title'>
                    <Link to='/' className='header__title__link' >
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
            </header >
            <main className='main'>
                <Outlet />
            </main>
        </>
    )
}

export default Layout
