import { Routes, Route } from 'react-router-dom'

import Layout from './layout/layout'

import Home from './pages/home'
import Podcast from './pages/podcast'
import Episode from './pages/episode'

import './assets/scss/index.scss'

const App = () => {
    return (
        <section className='container'>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route
                        path='podcast/:podcastId'
                        element={<Podcast />}
                    />
                    <Route
                        path='podcast/:podcastId/episode/:episodeId'
                        element={<Episode />}
                    />
                    <Route path='*' element={<Home />} />
                </Route>
            </Routes>
        </section>
    )
}

export default App
