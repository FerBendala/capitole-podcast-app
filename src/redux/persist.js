import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import podcastsReducer from './reducers/podcasts-reducer'

const persistConfig = {
    key: 'podcasts',
    storage,
}

const persistedPodcastsReducer =
    persistReducer( persistConfig, podcastsReducer )

export { persistedPodcastsReducer }
