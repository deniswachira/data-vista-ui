import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { userApi } from '../features/api/userApiSlice';
import { dataApi } from '../features/api/dataApiSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// Persist config for auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated', 'role'],
};

// Persist config for dataApi slice
const dataPersistConfig = {
  key: 'dataApi',
  storage,
  whitelist: [dataApi.reducerPath], // Persist the API data
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedDataReducer = persistReducer(dataPersistConfig, dataApi.reducer);

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [dataApi.reducerPath]: persistedDataReducer, // Use the persisted data reducer
    auth: persistedAuthReducer,
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
