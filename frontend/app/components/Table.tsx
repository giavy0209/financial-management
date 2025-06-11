/** @format */

"use client"

import { ReactNode } from "react"

/** @format */

/** @format */

/** @format */

/** @format */

export interface Column<T> {
  header: string
  key: keyof T | "actions"
  align?: "left" | "center" | "right"
  render?: (item: T) => ReactNode
}

export interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
    pageSizeOptions?: number[]
  }
}

export default function Table<T>({
  columns,
  data,
  loading = false,
  pagination,
}: TableProps<T>) {
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0
  const pageSizeOptions = pagination?.pageSizeOptions || [10, 20, 50]

  const getCellContent = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item)
    }
    if (column.key === "actions") {
      return null
    }
    return String(item[column.key])
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className={`px-6 py-3 text-${column.align || "left"} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-6 py-4 whitespace-nowrap text-${column.align || "left"} ${
                        column.key === "actions"
                          ? "text-sm font-medium space-x-2"
                          : "text-sm text-gray-900"
                      }`}
                    >
                      {getCellContent(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700">Show</span>
            <select
              value={pagination.pageSize}
              onChange={(e) =>
                pagination.onPageSizeChange(Number(e.target.value))
              }
              className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              {pageSizeOptions.map((size) => (
                <option
                  key={size}
                  value={size}
                >
                  {size}
                </option>
              ))}
            </select>
            <span className="ml-2 text-sm text-gray-700">entries</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {totalPages}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
