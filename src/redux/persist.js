import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import counterSlice from './reducers/counter-reducer'


const persistConfig = {
    key: 'root',
    storage,
}

const persistedCounterSliceReducer =
    persistReducer( persistConfig, counterSlice )

export { persistedCounterSliceReducer }