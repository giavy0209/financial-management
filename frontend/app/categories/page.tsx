/** @format */

"use client"

import CategoryTable from "./components/CategoryTable"
import CreateCategoryButton from "./components/CreateCategoryButton"

/** @format */

/** @format */

export default function CategoriesPage() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all categories in your account.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <CreateCategoryButton />
        </div>
      </div>

      <div className="mt-8">
        <CategoryTable />
      </div>
    </div>
  )
}
