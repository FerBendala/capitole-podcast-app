import { Routes, Route } from 'react-router-dom'

import Layout from './layout/layout'

import Home from './pages/home'

import './assets/scss/index.scss'

const App = () => {
    return (
        <section className='container'>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* App Content */}
                    <Route index element={<Home />} />
                </Route>
            </Routes>
        </section>
    )
}

export default App
