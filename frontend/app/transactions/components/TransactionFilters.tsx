/** @format */

"use client"

import { Fragment, memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { setFilters, clearFilters } from "@/store/features/transaction/transactionSlice"
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react"
import { FunnelIcon } from "@heroicons/react/24/outline"
import CategorySelect from "./CategorySelect"

type FilterValue = number | string
type FilterKey = "categoryId" | "fromAmount" | "toAmount" | "fromDate" | "toDate"

const TransactionFilters = memo(() => {
  const dispatch = useDispatch<AppDispatch>()
  const filters = useSelector((state: RootState) => state.transaction.filters)

  const handleFilterChange = (key: FilterKey, value: FilterValue) => {
    const newFilters = {
      ...filters,
      [key]: value === "" || (key === "categoryId" && value === 0) ? undefined : value,
    }

    // Remove undefined values
    const cleanFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        return { ...acc, [key]: value }
      }
      return acc
    }, {})

    dispatch(setFilters(cleanFilters))
  }

  // Check if any filter is active
  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <Popover className="relative">
      <PopoverButton
        className={`inline-flex items-center justify-center rounded-md border ${
          hasActiveFilters ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white"
        } px-4 py-2 text-sm font-medium ${
          hasActiveFilters ? "text-indigo-700" : "text-gray-700"
        } shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      >
        <FunnelIcon className={`-ml-1 mr-2 h-5 w-5 ${hasActiveFilters ? "text-indigo-600" : "text-gray-400"}`} />
        Filters
        {hasActiveFilters && <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">Active</span>}
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute right-0 z-10 mt-3 w-screen max-w-sm transform px-4 sm:px-0">
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="relative bg-white p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <CategorySelect value={filters.categoryId || 0} onChange={(value) => handleFilterChange("categoryId", value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Amount</label>
                    <input
                      type="number"
                      value={filters.fromAmount || ""}
                      onChange={(e) => handleFilterChange("fromAmount", e.target.value ? parseFloat(e.target.value) : "")}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Min"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Amount</label>
                    <input
                      type="number"
                      value={filters.toAmount || ""}
                      onChange={(e) => handleFilterChange("toAmount", e.target.value ? parseFloat(e.target.value) : "")}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={filters.fromDate || ""}
                      onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={filters.toDate || ""}
                      onChange={(e) => handleFilterChange("toDate", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => dispatch(clearFilters())}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  )
})

TransactionFilters.displayName = "TransactionFilters"

export default TransactionFilters
