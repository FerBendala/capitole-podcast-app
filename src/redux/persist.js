import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import globalReducer from './reducers/global-reducer'
import homeReducer from './reducers/podcasts-reducer'

const persistConfig = {
    key: 'root',
    storage,
}

const persistedGlobalReducer =
    persistReducer( persistConfig, globalReducer )
const persistedHomeReducer =
    persistReducer( persistConfig, homeReducer )

export {
    persistedGlobalReducer,
    persistedHomeReducer
}
