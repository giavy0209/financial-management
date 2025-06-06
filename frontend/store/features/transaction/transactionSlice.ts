/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { client } from "@/lib/apollo-client"
import { gql } from "@apollo/client"
import { ERROR_FRAGMENT } from "@/graphql/fragments"
import { CreateTransactionInput, GetTransactionInput, UpdateTransactionInput } from "@/graphql/types"
import { handleGraphQLError, handleGraphQLMessage } from "@/lib/utils"
import {
  GetTransactionsQuery,
  GetTransactionsQueryVariables,
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
  UpdateTransactionMutation,
  UpdateTransactionMutationVariables,
  TransactionFieldsFragment,
} from "@/graphql/queries"

const TRANSACTION_FRAGMENT = gql`
  fragment TransactionFields on Transaction {
    amount
    category {
      id
      name
    }
    description
    id
    createdAt
  }
`

const GET_TRANSACTIONS = gql`
  ${TRANSACTION_FRAGMENT}
  ${ERROR_FRAGMENT}
  query GetTransactions($filter: GetTransactionInput!, $pagination: PaginationInput) {
    transactions(filter: $filter, pagination: $pagination) {
      ... on ErrorOutput {
        ...ErrorFields
      }
      ... on TransactionList {
        data {
          ...TransactionFields
        }
        message
        pagination {
          page
          pageSize
          total
        }
        statusCode
      }
    }
  }
`

const CREATE_TRANSACTION = gql`
  ${TRANSACTION_FRAGMENT}
  ${ERROR_FRAGMENT}
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      ... on ErrorOutput {
        ...ErrorFields
      }
      ... on TransactionMutation {
        data {
          ...TransactionFields
        }
        message
        statusCode
      }
    }
  }
`

const UPDATE_TRANSACTION = gql`
  ${TRANSACTION_FRAGMENT}
  ${ERROR_FRAGMENT}
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      ... on ErrorOutput {
        ...ErrorFields
      }
      ... on TransactionMutation {
        data {
          ...TransactionFields
        }
        message
        statusCode
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
    id: number | null
    description: string
    amount: number
    categoryId: number
  }
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
  editingTransaction: {
    id: null,
    description: "",
    amount: 0,
    categoryId: 0,
  },
  filters: {},
}

// Async Thunks
export const getTransactions = createAsyncThunk<GetTransactionsQuery["transactions"], GetTransactionsQueryVariables>(
  "transaction/getTransactions",
  async (input, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.query<GetTransactionsQuery, GetTransactionsQueryVariables>({
        query: GET_TRANSACTIONS,
        variables: input,
      })

      if (data.transactions.__typename === "TransactionList") {
        return fulfillWithValue(data.transactions)
      }
      return rejectWithValue(data.transactions)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createTransaction = createAsyncThunk<CreateTransactionMutation["createTransaction"], CreateTransactionInput>(
  "transaction/createTransaction",
  async (input, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.mutate<CreateTransactionMutation, CreateTransactionMutationVariables>({
        mutation: CREATE_TRANSACTION,
        variables: { input },
        refetchQueries: [{ query: GET_TRANSACTIONS }],
      })

      if (!data) return rejectWithValue(data)
      if (data.createTransaction.__typename === "TransactionMutation") {
        return fulfillWithValue(data.createTransaction)
      }
      return rejectWithValue(data.createTransaction)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateTransaction = createAsyncThunk<UpdateTransactionMutation["updateTransaction"], UpdateTransactionInput>(
  "transaction/updateTransaction",
  async (input, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.mutate<UpdateTransactionMutation, UpdateTransactionMutationVariables>({
        mutation: UPDATE_TRANSACTION,
        variables: { input },
        refetchQueries: [{ query: GET_TRANSACTIONS }],
      })

      if (!data) return rejectWithValue(data)
      if (data.updateTransaction.__typename === "TransactionMutation") {
        return fulfillWithValue(data.updateTransaction)
      }
      return rejectWithValue(data.updateTransaction)
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
    startEditing: (state, action) => {
      const { id, description, amount, categoryId } = action.payload
      state.editingTransaction = { id, description, amount, categoryId }
    },
    cancelEditing: (state) => {
      state.editingTransaction = { ...initialState.editingTransaction }
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
    // Get Transactions
    builder
      .addCase(getTransactions.pending, (state) => {
        state.loading = true
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        if (action.payload.__typename === "TransactionList") {
          state.transactions = action.payload.data
          state.pagination.total = action.payload.pagination.total
        }
        state.loading = false
      })
      .addCase(getTransactions.rejected, (state, { payload }) => {
        state.loading = false
        handleGraphQLError(payload, "Failed to fetch transactions", "Could not load transactions. Please try again")
      })

    // Create Transaction
    builder
      .addCase(createTransaction.fulfilled, (_, action) => {
        if (action.payload.__typename === "TransactionMutation") {
          handleGraphQLMessage(action.payload)
        }
      })
      .addCase(createTransaction.rejected, (_, { payload }) => {
        handleGraphQLError(payload, "Failed to create transaction", "Could not create transaction. Please try again")
      })

    // Update Transaction
    builder
      .addCase(updateTransaction.fulfilled, (state, action) => {
        if (action.payload.__typename === "TransactionMutation") {
          state.editingTransaction = { ...initialState.editingTransaction }
          handleGraphQLMessage(action.payload)
        }
      })
      .addCase(updateTransaction.rejected, (_, { payload }) => {
        handleGraphQLError(payload, "Failed to update transaction", "Could not update transaction. Please try again")
      })
  },
})

export const { setPage, setPageSize, startEditing, cancelEditing, setFilters, clearFilters } = transactionSlice.actions
export default transactionSlice.reducer
