/** @format */

"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { createCategory, getCategories, setPage } from "@/store/features/category/categorySlice"
import Modal from "@/app/components/Modal"

export default function CreateCategoryButton() {
  const dispatch = useDispatch<AppDispatch>()
  const { pageSize } = useSelector((state: RootState) => state.category.pagination)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categoryName, setCategoryName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(createCategory({ name: categoryName })).unwrap()
      // Reset to first page and refetch with current pageSize
      dispatch(setPage(1))
      dispatch(getCategories({ page: 1, pageSize }))
      setIsModalOpen(false)
      setCategoryName("")
    } catch (error: unknown) {
      console.error("Failed to create category:", error)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Create Category
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setCategoryName("")
        }}
        title="Create Category"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setCategoryName("")
              }}
              className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
