/** @format */

import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/user/userSlice"
import categoryReducer from "./features/category/categorySlice"
import transactionReducer from "./features/transaction/transactionSlice"
import moneySourceReducer from "./features/moneySource/moneySourceSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    transaction: transactionReducer,
    moneySource: moneySourceReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
