import { Routes, Route } from 'react-router-dom'

import ReducerTest from './components/reducer-test'

import './scss/index.scss'

const App = () => {
    return (
        <section className='container'>
            <Routes>
                <Route path="/" element={<ReducerTest />} />
            </Routes>
        </section>
    )
}

export default App
