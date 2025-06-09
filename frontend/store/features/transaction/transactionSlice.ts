/** @format */

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { client } from "@/lib/apollo-client"
import { gql } from "@apollo/client"
import { ERROR_FRAGMENT, PAGINATION_FRAGMENT } from "@/graphql/fragments"
import { CreateTransactionInput, GetTransactionInput, UpdateTransactionInput } from "@/graphql/types"
import {
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
  TransactionFieldsFragment,
  UpdateTransactionMutation,
  UpdateTransactionMutationVariables,
} from "@/graphql/queries"
import { handleGraphQLError, handleGraphQLMessage } from "@/lib/utils"

// GraphQL Fragments
export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    description
    amount
    category {
      id
      name
    }
    moneySource {
      id
      name
    }
    createdAt
  }
`

const GET_TRANSACTIONS = gql`
  ${TRANSACTION_FIELDS}
  ${ERROR_FRAGMENT}
  ${PAGINATION_FRAGMENT}
  query GetTransactions($filter: GetTransactionInput!, $pagination: PaginationInput) {
    transactions(filter: $filter, pagination: $pagination) {
      ... on TransactionList {
        message
        statusCode
        data {
          ...TransactionFields
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

const CREATE_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  ${ERROR_FRAGMENT}
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      ... on TransactionMutation {
        message
        statusCode
        data {
          ...TransactionFields
        }
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

const UPDATE_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  ${ERROR_FRAGMENT}
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      ... on TransactionMutation {
        message
        statusCode
        data {
          ...TransactionFields
        }
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

interface TransactionState {
  transactions: TransactionFieldsFragment[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
  loading: boolean
  editingTransaction: {
    id: number
    description: string
    amount: number
    category: {
      id: number
      name: string
    }
    moneySource: {
      id: number
      name: string
    }
    createdAt: string
  } | null
  filters: GetTransactionInput
}

const initialState: TransactionState = {
  transactions: [],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  editingTransaction: null,
  filters: {},
}

export const getTransactions = createAsyncThunk(
  "transaction/getTransactions",
  async ({ filter, pagination }: { filter: GetTransactionInput; pagination: { page: number; pageSize: number } }) => {
    const response = await client.query({
      query: GET_TRANSACTIONS,
      variables: { filter, pagination },
    })
    return response.data.transactions
  }
)

export const createTransaction = createAsyncThunk<CreateTransactionMutation["createTransaction"], CreateTransactionInput>(
  "transaction/createTransaction",
  async (input, { rejectWithValue }) => {
    const response = await client.mutate<CreateTransactionMutation, CreateTransactionMutationVariables>({
      mutation: CREATE_TRANSACTION,
      variables: { input },
    })
    if (response.data?.createTransaction.__typename === "TransactionMutation") {
      return response.data.createTransaction
    }
    return rejectWithValue(response.data?.createTransaction)
  }
)

export const updateTransaction = createAsyncThunk<UpdateTransactionMutation["updateTransaction"], UpdateTransactionInput>(
  "transaction/updateTransaction",
  async (input, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate<UpdateTransactionMutation, UpdateTransactionMutationVariables>({
        mutation: UPDATE_TRANSACTION,
        variables: { input },
      })
      if (!data) return rejectWithValue(data)
      if (data?.updateTransaction.__typename === "TransactionMutation") {
        return data.updateTransaction
      }
      return rejectWithValue(data?.updateTransaction)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload
    },
    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload
      state.pagination.page = 1 // Reset to first page when changing page size
    },
    startEditing: (
      state,
      action: PayloadAction<{
        id: number
        description: string
        amount: number
        category: { id: number; name: string }
        moneySource: { id: number; name: string }
        createdAt: string
      }>
    ) => {
      const { id, description, amount, category, moneySource, createdAt } = action.payload
      state.editingTransaction = { id, description, amount, category, moneySource, createdAt }
    },
    cancelEditing: (state) => {
      state.editingTransaction = null
    },
    setFilters: (state, action) => {
      state.filters = action.payload
      state.pagination.page = 1 // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = {}
      state.pagination.page = 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTransactions.pending, (state) => {
        state.loading = true
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        if (action.payload.data) {
          state.transactions = action.payload.data
          state.pagination.total = action.payload.pagination.total
        }
        state.loading = false
      })
      .addCase(getTransactions.rejected, (state) => {
        state.loading = false
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        handleGraphQLMessage(action.payload)
      })
      .addCase(createTransaction.rejected, (state, action) => {
        handleGraphQLError(action.payload)
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        handleGraphQLMessage(action.payload)
        state.editingTransaction = null
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        handleGraphQLError(action.payload)
      })
  },
})

export const { setPage, setPageSize, startEditing, cancelEditing, setFilters, clearFilters } = transactionSlice.actions
export default transactionSlice.reducer
