import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import podcastsReducer from './reducers/podcasts-reducer'

const persistConfig = {
    key: 'root',
    storage,
}

const persistedPodcastsReducer =
    persistReducer( persistConfig, podcastsReducer )

export { persistedPodcastsReducer }
