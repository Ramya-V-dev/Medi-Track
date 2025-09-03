import { configureStore } from '@reduxjs/toolkit';
import PatientIdentifierReducer from './slice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from 'redux';

// import LibertycheckReducer from './slice';

// const persistConfig = {
//   key: 'root',
//   storage,
//   // Optionally blacklist specific parts of the state (not to be persisted)
//   // blacklist: ['someTransientState']
// };

// const rootReducer = combineReducers({
//   PatientIdentifier: PatientIdentifierReducer,
//   // other reducers...
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export const persistor = persistStore(store);


const store = configureStore({
  reducer: {
    PatientIdentifier: PatientIdentifierReducer,
    

    // Add other reducers here if needed
  },
});

export default store;