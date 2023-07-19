import { configureStore } from '@reduxjs/toolkit'
import { persistStore, REHYDRATE, PERSIST } from 'redux-persist'
import { persistedCounterSliceReducer } from './persist'


const rootReducer = {
    counter: persistedCounterSliceReducer,
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