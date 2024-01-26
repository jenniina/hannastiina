import { configureStore } from '@reduxjs/toolkit'
import serviceReducer from './reducers/serviceReducer'
import introReducer from './reducers/introReducer'
import categoryReducer from './reducers/categoryReducer'
import usersReducer from './reducers/usersReducer'
import orderByReducer from './reducers/orderByReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    services: serviceReducer,
    intro: introReducer,
    categories: categoryReducer,
    orderBy: orderByReducer,
    users: usersReducer,
    notification: notificationReducer,
  },
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
