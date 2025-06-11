/** @format */

"use client"

import { useDispatch, useSelector } from "react-redux"

import { useEffect } from "react"

import Table, { Column } from "@/app/components/Table"
import { Category } from "@/graphql/types"
import {
  cancelEditing,
  deleteCategory,
  getCategories,
  setPage,
  setPageSize,
  startEditing,
  updateCategory,
} from "@/store/features/category/categorySlice"
import { AppDispatch, RootState } from "@/store/store"

/** @format */

/** @format */

/** @format */

/** @format */

const PAGE_SIZES = [10, 20, 50]

export default function CategoryTable() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    categories,
    pagination: { page, pageSize, total },
    loading,
    editingCategory,
  } = useSelector((state: RootState) => state.category)

  useEffect(() => {
    dispatch(
      getCategories({
        page,
        pageSize,
      }),
    )
  }, [dispatch, page, pageSize])

  const handleEdit = (id: number, name: string) => {
    dispatch(
      startEditing({
        id,
        name,
      }),
    )
  }

  const handleSave = async (id: number) => {
    try {
      await dispatch(
        updateCategory({
          id,
          name: editingCategory.name,
        }),
      ).unwrap()
      dispatch(
        getCategories({
          page,
          pageSize,
        }),
      )
    } catch (error: unknown) {
      console.error("Failed to update category:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await dispatch(
        deleteCategory({
          id,
        }),
      ).unwrap()
      dispatch(
        getCategories({
          page,
          pageSize,
        }),
      )
    } catch (error: unknown) {
      console.error("Failed to delete category:", error)
    }
  }

  const columns: Column<Category>[] = [
    {
      header: "Name",
      key: "name",
      render: (category) =>
        editingCategory.id === category.id ? (
          <input
            type="text"
            value={editingCategory.name}
            onChange={(e) =>
              dispatch(
                startEditing({
                  id: category.id,
                  name: e.target.value,
                }),
              )
            }
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        ) : (
          <div className="text-sm text-gray-900">{category.name}</div>
        ),
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (category) =>
        editingCategory.id === category.id ? (
          <>
            <button
              onClick={() => handleSave(category.id)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Save
            </button>
            <button
              onClick={() => dispatch(cancelEditing())}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleEdit(category.id, category.name)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </>
        ),
    },
  ]

  return (
    <Table<Category>
      columns={columns}
      data={categories}
      loading={loading}
      pagination={{
        page,
        pageSize,
        total,
        onPageChange: (newPage) => dispatch(setPage(newPage)),
        onPageSizeChange: (newPageSize) => dispatch(setPageSize(newPageSize)),
        pageSizeOptions: PAGE_SIZES,
      }}
    />
  )
}
