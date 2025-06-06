/** @format */

"use client"

import CategoryTable from "./components/CategoryTable"
import CreateCategoryButton from "./components/CreateCategoryButton"

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <CreateCategoryButton />
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <CategoryTable />
      </div>
    </div>
  )
}
