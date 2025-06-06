/** @format */

import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/user/userSlice"
import categoryReducer from "./features/category/categorySlice"
import transactionReducer from "./features/transaction/transactionSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    transaction: transactionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
