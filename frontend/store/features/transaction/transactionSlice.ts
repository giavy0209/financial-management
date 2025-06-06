/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { client } from "@/lib/apollo-client"
import { gql } from "@apollo/client"
import { ERROR_FRAGMENT } from "@/graphql/fragments"
import { Transaction, CreateTransactionInput, DeleteTransactionInput, PaginationInput, UpdateTransactionInput } from "@/graphql/types"
import { handleGraphQLError, handleGraphQLMessage } from "@/lib/utils"

const TRANSACTION_FRAGMENT = gql`
  fragment TransactionFields on Transaction {
    id
    name
    amount
    date
  }
`

const GET_TRANSACTIONS = gql`
  ${TRANSACTION_FRAGMENT}
  ${ERROR_FRAGMENT}
  query GetTransactions($pagination: PaginationInput!) {
    transactions(pagination: $pagination) {
      ... on TransactionList {
        message
        statusCode
        data {
          ...TransactionFields
        }
        pagination {
          page
          pageSize
          total
        }
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

const CREATE_TRANSACTION = gql`
  ${TRANSACTION_FRAGMENT}
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
  ${TRANSACTION_FRAGMENT}
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

const DELETE_TRANSACTION = gql`
  ${ERROR_FRAGMENT}
  mutation DeleteTransaction($input: DeleteTransactionInput!) {
    deleteTransaction(input: $input) {
      ... on BooleanMutation {
        message
        statusCode
        data
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

interface TransactionState {
  transactions: Transaction[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
  loading: boolean
  editingTransaction: {
    id: number | null
    name: string
    amount: number
    date: string
  }
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
    name: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  },
}

// Async Thunks
export const getTransactions = createAsyncThunk<GetTransactionsQuery["transactions"], PaginationInput>(
  "transaction/getTransactions",
  async (input, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.query<GetTransactionsQuery, GetTransactionsQueryVariables>({
        query: GET_TRANSACTIONS,
        variables: { pagination: input },
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

export const deleteTransaction = createAsyncThunk<DeleteTransactionMutation["deleteTransaction"], DeleteTransactionInput>(
  "transaction/deleteTransaction",
  async (input, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.mutate<DeleteTransactionMutation, DeleteTransactionMutationVariables>({
        mutation: DELETE_TRANSACTION,
        variables: { input },
        refetchQueries: [{ query: GET_TRANSACTIONS }],
      })

      if (!data) return rejectWithValue(data)
      if (data.deleteTransaction.__typename === "BooleanMutation") {
        return fulfillWithValue(data.deleteTransaction)
      }
      return rejectWithValue(data.deleteTransaction)
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
      const { id, name, amount, date } = action.payload
      state.editingTransaction = { id, name, amount, date }
    },
    cancelEditing: (state) => {
      state.editingTransaction = { ...initialState.editingTransaction }
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
          handleGraphQLMessage(action.payload)
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

    // Delete Transaction
    builder
      .addCase(deleteTransaction.fulfilled, (_, action) => {
        if (action.payload.__typename === "BooleanMutation") {
          handleGraphQLMessage(action.payload)
        }
      })
      .addCase(deleteTransaction.rejected, (_, { payload }) => {
        handleGraphQLError(payload, "Failed to delete transaction", "Could not delete transaction. Please try again")
      })
  },
})

export const { setPage, setPageSize, startEditing, cancelEditing } = transactionSlice.actions
export default transactionSlice.reducer
