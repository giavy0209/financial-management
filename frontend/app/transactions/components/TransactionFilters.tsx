"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { FunnelIcon } from "@heroicons/react/24/outline"
import { useDispatch, useSelector } from "react-redux"

import { Fragment, memo } from "react"

import { FormInput } from "@/app/components/form"
import {
  clearFilters,
  setFilters,
} from "@/store/features/transaction/transactionSlice"
import { AppDispatch, RootState } from "@/store/store"

import CategorySelect from "./CategorySelect"
import MoneySourceSelect from "./MoneySourceSelect"

type FilterValue = number | string
type FilterKey =
  | "categoryId"
  | "moneySourceId"
  | "fromAmount"
  | "toAmount"
  | "fromDate"
  | "toDate"

const TransactionFilters = memo(() => {
  const dispatch = useDispatch<AppDispatch>()
  const filters = useSelector((state: RootState) => state.transaction.filters)

  const handleFilterChange = (key: FilterKey, value: FilterValue) => {
    const newFilters = {
      ...filters,
      [key]:
        value === "" || (key === "categoryId" && value === 0)
          ? undefined
          : value,
    }

    // Remove undefined values
    const cleanFilters = Object.entries(newFilters).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          return {
            ...acc,
            [key]: value,
          }
        }
        return acc
      },
      {},
    )

    dispatch(setFilters(cleanFilters))
  }

  // Check if any filter is active
  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <Popover className="relative">
      <PopoverButton
        className={`inline-flex items-center justify-center rounded-md border ${
          hasActiveFilters
            ? "border-indigo-600 bg-indigo-50"
            : "border-gray-300 bg-white"
        } px-4 py-2 text-sm font-medium ${
          hasActiveFilters ? "text-indigo-700" : "text-gray-700"
        } shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      >
        <FunnelIcon
          className={`-ml-1 mr-2 h-5 w-5 ${hasActiveFilters ? "text-indigo-600" : "text-gray-400"}`}
        />
        Filters
        {hasActiveFilters && (
          <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
            Active
          </span>
        )}
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
        <PopoverPanel className="absolute right-0 z-10 mt-3 w-screen max-w-sm h-[400px] transform px-4 sm:px-0">
          <div className="overflow-hidden rounded-lg h-full shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="relative h-full bg-white p-6">
              <div className="space-y-4">
                <div>
                  <CategorySelect
                    value={filters.categoryId || 0}
                    onChange={(value) =>
                      handleFilterChange("categoryId", value)
                    }
                  />
                </div>
                <MoneySourceSelect
                  value={filters.moneySourceId || 0}
                  onChange={(value) =>
                    handleFilterChange("moneySourceId", value)
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="From Amount"
                    type="number"
                    value={filters.fromAmount || ""}
                    onChange={(value) =>
                      handleFilterChange("fromAmount", value as number)
                    }
                    placeholder="Min"
                  />

                  <FormInput
                    label="To Amount"
                    type="number"
                    value={filters.toAmount || ""}
                    onChange={(value) =>
                      handleFilterChange("toAmount", value as number)
                    }
                    placeholder="Max"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="From Date"
                    type="date"
                    value={filters.fromDate || ""}
                    onChange={(value) =>
                      handleFilterChange("fromDate", value as string)
                    }
                  />

                  <FormInput
                    label="To Date"
                    type="date"
                    value={filters.toDate || ""}
                    onChange={(value) =>
                      handleFilterChange("toDate", value as string)
                    }
                  />
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
