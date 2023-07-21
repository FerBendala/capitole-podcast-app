import { configureStore } from '@reduxjs/toolkit'
import { persistStore, REHYDRATE, PERSIST } from 'redux-persist'
import { persistedHomeReducer, persistedGlobalReducer } from './persist'

const rootReducer = {
    global: persistedGlobalReducer,
    podcasts: persistedHomeReducer,
}

const store = configureStore( {
    reducer: rootReducer,
    middleware: ( getDefaultMiddleware ) =>
        getDefaultMiddleware( {
            serializableCheck: {
                ignoredActions: [PERSIST, REHYDRATE],
            },
        } ),
} )

const persistor = persistStore( store )

export { store, persistor }
