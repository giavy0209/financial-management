/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { client } from "@/lib/apollo-client"
import { gql } from "@apollo/client"
import { ERROR_FRAGMENT, PAGINATION_FRAGMENT } from "@/graphql/fragments"
import { CreateTransactionInput, GetTransactionInput } from "@/graphql/types"
import { CreateTransactionMutation, CreateTransactionMutationVariables, TransactionFieldsFragment } from "@/graphql/queries"
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
    id: number | null
    description: string
    amount: number
    categoryId: number
    moneySourceId: number
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
    moneySourceId: 0,
  },
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

export const updateTransaction = createAsyncThunk(
  "transaction/updateTransaction",
  async (input: { id: number; description: string; amount: number; categoryId: number; moneySourceId: number }) => {
    const response = await client.mutate({
      mutation: UPDATE_TRANSACTION,
      variables: { input },
    })
    return response.data.updateTransaction
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
      const { id, description, amount, categoryId, moneySourceId } = action.payload
      state.editingTransaction = { id, description, amount, categoryId, moneySourceId }
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
  },
})

export const { setPage, setPageSize, startEditing, cancelEditing, setFilters, clearFilters } = transactionSlice.actions
export default transactionSlice.reducer
