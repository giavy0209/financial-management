/** @format */
import { gql } from "@apollo/client"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"

import { ERROR_FRAGMENT } from "@/graphql/fragments"
import {
  LoginMutation,
  LoginMutationVariables,
  SignupMutation,
  SignupMutationVariables,
  UserFieldsFragment,
} from "@/graphql/queries"
import { LoginInput, SignupInput } from "@/graphql/types"
import { client } from "@/lib/apollo-client"
import { handleGraphQLError, handleGraphQLMessage } from "@/lib/utils"

const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    email
    name
    createdAt
    updatedAt
  }
`

const SIGNUP_MUTATION = gql`
  ${ERROR_FRAGMENT}
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      ... on SignupMutation {
        message
        statusCode
        data {
          success
        }
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  ${USER_FRAGMENT}
  ${ERROR_FRAGMENT}
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ... on LoginMutation {
        message
        statusCode
        data {
          token
          user {
            ...UserFields
          }
        }
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

const GET_CURRENT_USER_QUERY = gql`
  ${USER_FRAGMENT}
  ${ERROR_FRAGMENT}
  query GetCurrentUser {
    me {
      ... on UserSingle {
        message
        statusCode
        data {
          ...UserFields
        }
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

export const signup = createAsyncThunk(
  "user/signup",
  async (input: SignupInput, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.mutate<
        SignupMutation,
        SignupMutationVariables
      >({
        mutation: SIGNUP_MUTATION,
        variables: { input },
      })

      if (!data) throw new Error("No data returned")

      if (data.signup.__typename === "ErrorOutput") {
        return rejectWithValue(data.signup)
      }
      if (data.signup.__typename === "SignupMutation") {
        return fulfillWithValue(data.signup)
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const login = createAsyncThunk(
  "user/login",
  async (input: LoginInput, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data, errors } = await client.mutate<
        LoginMutation,
        LoginMutationVariables
      >({
        mutation: LOGIN_MUTATION,
        variables: { input },
      })

      if (!data) throw new Error("No data returned")
      if (Array.isArray(errors) && errors.length > 0) {
        return rejectWithValue(errors)
      }

      if (data.login.__typename === "ErrorOutput") {
        return rejectWithValue(data.login)
      }
      if (data.login.__typename === "LoginMutation") {
        // Store token in cookies
        Cookies.set("token", data.login.data.token, {
          expires: 7, // 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        return fulfillWithValue(data.login)
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_CURRENT_USER_QUERY,
        fetchPolicy: "network-only", // Don't use cache for this query
      })

      if (!data) throw new Error("No data returned")

      if (data.me.__typename === "ErrorOutput") {
        return rejectWithValue(data.me)
      }

      if (data.me.__typename === "UserSingle") {
        return fulfillWithValue(data.me)
      }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

type UserState = {
  isLoggedIn: boolean
  user: UserFieldsFragment | null
  loading: boolean
}

const initialState: UserState = {
  isLoggedIn: false,
  user: null,
  loading: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false
      state.user = null
      Cookies.remove("token")
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (_, { payload }) => {
        if (payload?.data.success) {
          handleGraphQLMessage(payload)
        }
      })
      .addCase(signup.rejected, (_, { payload }) => {
        handleGraphQLError(
          payload,
          "Signup failed",
          "Could not create your account. Please try again",
        )
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        if (payload) {
          state.isLoggedIn = true
          state.user = payload.data.user
          handleGraphQLMessage(payload)
        }
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.isLoggedIn = false
        state.user = null
        handleGraphQLError(
          payload,
          "Login failed",
          "Please check your credentials and try again",
        )
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, { payload }) => {
        state.loading = false
        if (payload) {
          state.isLoggedIn = true
          state.user = payload.data
        }
      })
      .addCase(getCurrentUser.rejected, (state, { payload }) => {
        state.loading = false
        state.isLoggedIn = false
        state.user = null
        handleGraphQLError(
          payload,
          "Failed to fetch user",
          "Could not get user information",
        )
      })
  },
})

export const { logout } = userSlice.actions
export default userSlice.reducer
