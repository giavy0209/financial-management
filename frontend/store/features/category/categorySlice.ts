/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { client } from "@/lib/apollo-client"
import { gql } from "@apollo/client"
import { ERROR_FRAGMENT } from "@/graphql/fragments"
import {
  CreateCategoryMutation,
  CreateCategoryMutationVariables,
  DeleteCategoryMutation,
  DeleteCategoryMutationVariables,
  UpdateCategoryMutation,
  UpdateCategoryMutationVariables,
  GetCategoriesQuery,
  GetCategoriesQueryVariables,
  CategoryFieldsFragment,
} from "@/graphql/queries"
import { CreateCategoryInput, DeleteCategoryInput, PaginationInput, UpdateCategoryInput } from "@/graphql/types"
import { handleGraphQLError, handleGraphQLMessage } from "@/lib/utils"

const CATEGORY_FRAGMENT = gql`
  fragment CategoryFields on Category {
    id
    name
  }
`

const GET_CATEGORIES = gql`
  ${CATEGORY_FRAGMENT}
  ${ERROR_FRAGMENT}
  query GetCategories($pagination: PaginationInput) {
    categories(pagination: $pagination) {
      ... on CategoryList {
        data {
          ...CategoryFields
        }
        message
        pagination {
          page
          pageSize
          total
        }
        statusCode
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

const CREATE_CATEGORY = gql`
  ${CATEGORY_FRAGMENT}
  ${ERROR_FRAGMENT}
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ... on CategoryMutation {
        message
        statusCode
        data {
          ...CategoryFields
        }
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

const UPDATE_CATEGORY = gql`
  ${CATEGORY_FRAGMENT}
  ${ERROR_FRAGMENT}
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      ... on CategoryMutation {
        message
        statusCode
        data {
          ...CategoryFields
        }
      }
      ... on ErrorOutput {
        ...ErrorFields
      }
    }
  }
`

const DELETE_CATEGORY = gql`
  ${ERROR_FRAGMENT}
  mutation DeleteCategory($input: DeleteCategoryInput!) {
    deleteCategory(input: $input) {
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

interface CategoryState {
  categories: CategoryFieldsFragment[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
  loading: boolean
  editingCategory: {
    id: number | null
    name: string
  }
}

const initialState: CategoryState = {
  categories: [],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  editingCategory: {
    id: null,
    name: "",
  },
}

// Async Thunks
export const getCategories = createAsyncThunk<GetCategoriesQuery["categories"], PaginationInput>("category/getCategories", async (input, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { data } = await client.query<GetCategoriesQuery, GetCategoriesQueryVariables>({
      query: GET_CATEGORIES,
      variables: { pagination: input },
    })

    if (data.categories.__typename === "CategoryList") {
      return fulfillWithValue(data.categories)
    }
    return rejectWithValue(data.categories)
  } catch (error) {
    return rejectWithValue(error)
  }
})

export const createCategory = createAsyncThunk<CreateCategoryMutation["createCategory"], CreateCategoryInput>(
  "category/createCategory",
  async (input, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.mutate<CreateCategoryMutation, CreateCategoryMutationVariables>({
        mutation: CREATE_CATEGORY,
        variables: { input },
        refetchQueries: [{ query: GET_CATEGORIES }],
      })

      if (!data) return rejectWithValue(data)
      if (data.createCategory.__typename === "CategoryMutation") {
        return fulfillWithValue(data.createCategory)
      }
      return rejectWithValue(data.createCategory)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateCategory = createAsyncThunk<UpdateCategoryMutation["updateCategory"], UpdateCategoryInput>(
  "category/updateCategory",
  async (input, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.mutate<UpdateCategoryMutation, UpdateCategoryMutationVariables>({
        mutation: UPDATE_CATEGORY,
        variables: { input },
        refetchQueries: [{ query: GET_CATEGORIES }],
      })

      if (!data) return rejectWithValue(data)

      if (data.updateCategory.__typename === "CategoryMutation") {
        return fulfillWithValue(data.updateCategory)
      }
      return rejectWithValue(data.updateCategory)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deleteCategory = createAsyncThunk<DeleteCategoryMutation["deleteCategory"], DeleteCategoryInput>(
  "category/deleteCategory",
  async (input, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await client.mutate<DeleteCategoryMutation, DeleteCategoryMutationVariables>({
        mutation: DELETE_CATEGORY,
        variables: { input },
        refetchQueries: [{ query: GET_CATEGORIES }],
      })

      if (!data) return rejectWithValue(data)

      if (data.deleteCategory.__typename === "BooleanMutation") {
        return fulfillWithValue(data.deleteCategory)
      }
      return rejectWithValue(data.deleteCategory)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const categorySlice = createSlice({
  name: "category",
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
      state.editingCategory = { id, name }
    },
    cancelEditing: (state) => {
      state.editingCategory = { id: null, name: "" }
    },
  },
  extraReducers: (builder) => {
    // Get Categories
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        if (action.payload.__typename === "CategoryList") {
          state.categories = action.payload.data
          state.pagination.total = action.payload.pagination.total
        }
        state.loading = false
      })
      .addCase(getCategories.rejected, (state, { payload }) => {
        state.loading = false
        handleGraphQLError(payload, "Failed to fetch categories", "Could not load categories. Please try again")
      })

    // Create Category
    builder
      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload.__typename === "CategoryMutation") {
          handleGraphQLMessage(action.payload)
        }
      })
      .addCase(createCategory.rejected, (_, { payload }) => {
        handleGraphQLError(payload, "Failed to create category", "Could not create category. Please try again")
      })

    // Update Category
    builder
      .addCase(updateCategory.fulfilled, (state, action) => {
        if (action.payload.__typename === "CategoryMutation") {
          state.editingCategory = { id: null, name: "" }
          handleGraphQLMessage(action.payload)
        }
      })
      .addCase(updateCategory.rejected, (_, { payload }) => {
        handleGraphQLError(payload, "Failed to update category", "Could not update category. Please try again")
      })

    // Delete Category
    builder
      .addCase(deleteCategory.fulfilled, (state, action) => {
        if (action.payload.__typename === "BooleanMutation") {
          handleGraphQLMessage(action.payload)
        }
      })
      .addCase(deleteCategory.rejected, (_, { payload }) => {
        handleGraphQLError(payload, "Failed to delete category", "Could not delete category. Please try again")
      })
  },
})

export const { setPage, setPageSize, startEditing, cancelEditing } = categorySlice.actions
export default categorySlice.reducer
