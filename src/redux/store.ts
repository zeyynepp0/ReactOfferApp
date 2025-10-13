import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import offersReducer from './offersSlice';
import authReducer from './authSlice';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  offers: offersReducer,
  auth: authReducer,
});// diğer reducerlar eklenebilir

const persistConfig = {
  key: 'root',
  storage,
};// sayfa yenilendiğinde redux state kaybolmasın diye

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
      },
    }),
});// merkezi depo olarak kullanılmasını sağlar

export const persistor = persistStore(store);

// Root state type - manually defined to avoid persistence issues
export interface RootState {
  offers: {
    offers: any[];
    loading: boolean;
    error: string | null;
  };
  auth: {
    isAuthenticated: boolean;
    user: {
      id: string;
      username: string;
      email: string;
    } | null;
    token: string | null;
  };
}

export type AppDispatch = typeof store.dispatch;// store'un dispatch fonksiyonunun tipini alır
