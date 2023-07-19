import { useDispatch, useSelector } from 'react-redux'
import { sumOne, removeClicks } from '../redux/reducers/counter-reducer'

const ReducerTest = () => {
    const dispatch = useDispatch()
    const counter = useSelector( state => state.counter )
    const clicks = counter.clicks
    return (
        <>
            <h2>REDUCER (clicks are saved in redux state)</h2>
            <button onClick={() => dispatch( sumOne( clicks ) )}>
                clicked {counter.clicks} times
            </button>
            <button onClick={() => dispatch( removeClicks() )}>
                Remove clicks
            </button>
        </>
    )
}

export default ReducerTest