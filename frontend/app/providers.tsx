/** @format */

"use client"

import { ApolloProvider } from "@apollo/client"
import { Provider } from "react-redux"

import { client } from "@/lib/apollo-client"
import { store } from "@/store/store"

/** @format */

/** @format */

/** @format */

/** @format */

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </Provider>
  )
}
