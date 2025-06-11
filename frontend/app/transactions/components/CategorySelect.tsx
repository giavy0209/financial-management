/** @format */

"use client"

import { useDispatch, useSelector } from "react-redux"

import { useEffect, useRef, useState } from "react"

import { CategoryFieldsFragment } from "@/graphql/queries"
import { getCategories } from "@/store/features/category/categorySlice"
import { AppDispatch, RootState } from "@/store/store"

/** @format */

/** @format */

/** @format */

/** @format */

interface CategorySelectProps {
  value?: number
  onChange: (categoryId: number) => void
}

export default function CategorySelect({
  value,
  onChange,
}: CategorySelectProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [page, setPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pageSize = 10

  const { categories, pagination, loading } = useSelector(
    (state: RootState) => state.category,
  )
  const selectedCategory = categories.find((cat) => cat.id === value)

  useEffect(() => {
    dispatch(
      getCategories({
        page,
        pageSize,
      }),
    )
  }, [dispatch, page, pageSize])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      Math.round(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) ===
      e.currentTarget.clientHeight
    if (bottom && !loading && page * pageSize < pagination.total) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white px-4 py-2 text-left border"
      >
        {selectedCategory ? selectedCategory.name : "Select a category"}
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          onScroll={handleScroll}
        >
          {categories.map((category: CategoryFieldsFragment) => (
            <div
              key={category.id}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white ${
                value === category.id
                  ? "bg-indigo-600 text-white"
                  : "text-gray-900"
              }`}
              onClick={() => {
                onChange(category.id)
                setIsOpen(false)
              }}
            >
              {category.name}
            </div>
          ))}
          {loading && (
            <div className="text-center py-2 text-gray-500">Loading...</div>
          )}
        </div>
      )}
    </div>
  )
}
