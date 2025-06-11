/** @format */
import { gql } from "@apollo/client"
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"

import { ERROR_FRAGMENT, PAGINATION_FRAGMENT } from "@/graphql/fragments"
import {
  CreateTransactionMutation,
  CreateTransactionMutationVariables,
  GetTransactionsQuery,
  GetTransactionsQueryVariables,
  UpdateTransactionMutation,
  UpdateTransactionMutationVariables,
} from "@/graphql/queries"
import {
  CreateTransactionInput,
  GetTransactionInput,
  UpdateTransactionInput,
} from "@/graphql/types"
import { client } from "@/lib/apollo-client"
import { handleGraphQLError, handleGraphQLMessage } from "@/lib/utils"

import { EditTransaction, TransactionState } from "./transactionType"

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
  query GetTransactions(
    $filter: GetTransactionInput!
    $pagination: PaginationInput
  ) {
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

const initialState: TransactionState = {
  transactions: [],
  filters: {},
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  editingTransaction: null,
  newTransaction: null,
}

export const getTransactions = createAsyncThunk<
  GetTransactionsQuery["transactions"],
  GetTransactionsQueryVariables
>(
  "transaction/getTransactions",
  async (
    variables: GetTransactionsQueryVariables,
    { rejectWithValue, fulfillWithValue },
  ) => {
    const { data } = await client.query<
      GetTransactionsQuery,
      GetTransactionsQueryVariables
    >({
      query: GET_TRANSACTIONS,
      variables,
    })

    if (!data) return rejectWithValue(data)
    if (data.transactions.__typename === "TransactionList") {
      return fulfillWithValue(data.transactions)
    }
    return rejectWithValue(data.transactions)
  },
)

export const createTransaction = createAsyncThunk<
  CreateTransactionMutation["createTransaction"],
  CreateTransactionInput
>("transaction/createTransaction", async (input, { rejectWithValue }) => {
  const response = await client.mutate<
    CreateTransactionMutation,
    CreateTransactionMutationVariables
  >({
    mutation: CREATE_TRANSACTION,
    variables: { input },
  })
  if (response.data?.createTransaction.__typename === "TransactionMutation") {
    return response.data.createTransaction
  }
  return rejectWithValue(response.data?.createTransaction)
})

export const updateTransaction = createAsyncThunk<
  UpdateTransactionMutation["updateTransaction"],
  UpdateTransactionInput
>("transaction/updateTransaction", async (input, { rejectWithValue }) => {
  try {
    const { data } = await client.mutate<
      UpdateTransactionMutation,
      UpdateTransactionMutationVariables
    >({
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
})

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload
      state.pagination.page = 1
    },
    setEditingTransaction: (
      state,
      action: PayloadAction<EditTransaction | null>,
    ) => {
      state.editingTransaction = action.payload
    },
    setFilters: (state, action: PayloadAction<GetTransactionInput>) => {
      state.filters = action.payload
      state.pagination.page = 1
    },
    clearFilters: (state) => {
      state.filters = {}
      state.pagination.page = 1
    },
    setNewTransaction: (
      state,
      action: PayloadAction<{
        amount: number
        description: string
        createdAt: string
        categoryId: number
        moneySourceId: number
      } | null>,
    ) => {
      state.newTransaction = action.payload
    },
  },
  extraReducers: (builder) => {
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
      .addCase(getTransactions.rejected, (state) => {
        state.loading = false
      })
      .addCase(createTransaction.pending, (state) => {
        state.loading = true
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.newTransaction = null
        handleGraphQLMessage(action.payload)
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false
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

export const {
  setPage,
  setPageSize,
  setEditingTransaction,
  setFilters,
  clearFilters,
  setNewTransaction,
} = transactionSlice.actions
export default transactionSlice.reducer
