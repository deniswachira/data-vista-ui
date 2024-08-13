import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { userApi } from '../features/api/userApiSlice';
import { dataApi } from '../features/api/dataApiSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import dataReducer from '../features/dataSlice';

// Persist config for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated', 'role'],
};

// Persist config for data slice
const dataPersistConfig = {
  key: 'data',
  storage,
  whitelist: ['gdpData', 'populationData', 'gdpPerCapitaData', 'exchangeRateData'], // Whitelist the slices you want to persist
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedDataReducer = persistReducer(dataPersistConfig, dataReducer);

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [dataApi.reducerPath]: dataApi.reducer,
    auth: persistedAuthReducer,
    data: persistedDataReducer, // Add the persisted data reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid serialization errors with redux-persist
    }).concat(userApi.middleware, dataApi.middleware), // Include the API middlewares
});

// Export the persisted store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
