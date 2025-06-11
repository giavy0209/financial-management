/** @format */
import {
 ApolloClient, InMemoryCache, createHttpLink 
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import Cookies from "js-cookie"

import { config } from "@/config"

const httpLink = createHttpLink({
  uri: config.graphqlUrl,
})

// Auth link middleware to add token to headers
const authLink = setContext((_, {
 headers 
}) => {
  // Get the token from cookies
  const token = Cookies.get("token")

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
})
