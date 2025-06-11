/** @format */
import { gql } from "@apollo/client"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { ERROR_FRAGMENT, PAGINATION_FRAGMENT } from "@/graphql/fragments"
import {
  CreateMoneySourceMutation,
  CreateMoneySourceMutationVariables,
  GetMoneySourcesQuery,
  GetMoneySourcesQueryVariables,
  MoneySourceFieldsFragment,
  UpdateMoneySourceMutation,
  UpdateMoneySourceMutationVariables,
} from "@/graphql/queries"
import { CreateMoneySourceInput, UpdateMoneySourceInput } from "@/graphql/types"
import { client } from "@/lib/apollo-client"
import { handleGraphQLError, handleGraphQLMessage } from "@/lib/utils"

// GraphQL Fragments
export const MONEY_SOURCE_FIELDS = gql`
  fragment MoneySourceFields on MoneySource {
    id
    name
    value
    createdAt
  }
`

// GraphQL Queries and Mutations
const GET_MONEY_SOURCES = gql`
  ${MONEY_SOURCE_FIELDS}
  ${ERROR_FRAGMENT}
  ${PAGINATION_FRAGMENT}
  query GetMoneySources($pagination: PaginationInput) {
    moneySources(pagination: $pagination) {
      ... on MoneySourceList {
        data {
          ...MoneySourceFields
        }
        pagination {
          ...PaginationFields
        }
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

const CREATE_MONEY_SOURCE = gql`
  ${MONEY_SOURCE_FIELDS}
  ${ERROR_FRAGMENT}
  mutation CreateMoneySource($input: CreateMoneySourceInput!) {
    createMoneySource(input: $input) {
      ... on MoneySourceMutation {
        data {
          ...MoneySourceFields
        }
        message
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

const UPDATE_MONEY_SOURCE = gql`
  ${MONEY_SOURCE_FIELDS}
  ${ERROR_FRAGMENT}
  mutation UpdateMoneySource($input: UpdateMoneySourceInput!) {
    updateMoneySource(input: $input) {
      ... on MoneySourceMutation {
        data {
          ...MoneySourceFields
        }
        message
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

interface MoneySourceState {
  moneySources: MoneySourceFieldsFragment[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
  loading: boolean
  editingMoneySource: {
    id: number
    name: string
  } | null
  newMoneySource: {
    name: string
    value: number
  } | null
}

const initialState: MoneySourceState = {
  moneySources: [],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  editingMoneySource: null,
  newMoneySource: null,
}

// Async Thunks
export const getMoneySources = createAsyncThunk<
  GetMoneySourcesQuery["moneySources"],
  GetMoneySourcesQueryVariables
>(
  "moneySource/getMoneySources",
  async (input, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.query<
        GetMoneySourcesQuery,
        GetMoneySourcesQueryVariables
      >({
        query: GET_MONEY_SOURCES,
        variables: input,
      })

      if (data.moneySources.__typename === "MoneySourceList") {
        return fulfillWithValue(data.moneySources)
      }
      return rejectWithValue(data.moneySources)
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const createMoneySource = createAsyncThunk<
  CreateMoneySourceMutation["createMoneySource"],
  CreateMoneySourceInput
>(
  "moneySource/createMoneySource",
  async (input, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.mutate<
        CreateMoneySourceMutation,
        CreateMoneySourceMutationVariables
      >({
        mutation: CREATE_MONEY_SOURCE,
        variables: { input },
        refetchQueries: [{ query: GET_MONEY_SOURCES }],
      })

      if (!data) return rejectWithValue(data)
      if (data.createMoneySource.__typename === "MoneySourceMutation") {
        return fulfillWithValue(data.createMoneySource)
      }
      return rejectWithValue(data.createMoneySource)
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const updateMoneySource = createAsyncThunk<
  UpdateMoneySourceMutation["updateMoneySource"],
  UpdateMoneySourceInput
>(
  "moneySource/updateMoneySource",
  async (input, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.mutate<
        UpdateMoneySourceMutation,
        UpdateMoneySourceMutationVariables
      >({
        mutation: UPDATE_MONEY_SOURCE,
        variables: { input },
        refetchQueries: [{ query: GET_MONEY_SOURCES }],
      })

      if (!data) return rejectWithValue(data)

      if (data.updateMoneySource.__typename === "MoneySourceMutation") {
        return fulfillWithValue(data.updateMoneySource)
      }
      return rejectWithValue(data.updateMoneySource)
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

const moneySourceSlice = createSlice({
  name: "moneySource",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload
    },
    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload
      state.pagination.page = 1 // Reset to first page when changing page size
    },
    startEditing: (state, action) => {
      const { id, name } = action.payload
      state.editingMoneySource = { id, name }
    },
    cancelEditing: (state) => {
      state.editingMoneySource = null
    },
    setNewMoneySource: (state, action) => {
      state.newMoneySource = action.payload
    },
  },
  extraReducers: (builder) => {
    // Get Money Sources
    builder
      .addCase(getMoneySources.pending, (state) => {
        state.loading = true
      })
      .addCase(getMoneySources.fulfilled, (state, action) => {
        if (action.payload.__typename === "MoneySourceList") {
          state.moneySources = action.payload.data
          state.pagination.total = action.payload.pagination.total
        }
        state.loading = false
      })
      .addCase(getMoneySources.rejected, (state, { payload }) => {
        state.loading = false
        handleGraphQLError(payload)
      })

    // Create Money Source
    builder.addCase(createMoneySource.fulfilled, (state, action) => {
      state.loading = false
      state.newMoneySource = null
      handleGraphQLMessage(action.payload)
    })
    builder.addCase(createMoneySource.rejected, (state, { payload }) => {
      state.loading = false
      handleGraphQLError(payload)
    })

    // Update Money Source
    builder.addCase(updateMoneySource.fulfilled, (state, action) => {
      state.loading = false
      state.editingMoneySource = null
      handleGraphQLMessage(action.payload)
    })
    builder.addCase(updateMoneySource.rejected, (state, { payload }) => {
      state.loading = false
      state.editingMoneySource = null
      handleGraphQLError(payload)
    })
  },
})

export const {
  setPage,
  setPageSize,
  startEditing,
  cancelEditing,
  setNewMoneySource,
} = moneySourceSlice.actions
export default moneySourceSlice.reducer
