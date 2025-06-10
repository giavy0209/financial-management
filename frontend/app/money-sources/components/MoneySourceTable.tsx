/** @format */

"use client"

import { memo, useEffect } from "react"
import { RootState } from "@/store/store"
import { getMoneySources, updateMoneySource, setPage, setPageSize, startEditing, cancelEditing } from "@/store/features/moneySource/moneySourceSlice"
import Table, { Column } from "@/app/components/Table"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { MoneySourceFieldsFragment } from "@/graphql/queries"
import { formatAmount } from "@/lib/utils"

const PAGE_SIZES = [10, 20, 50]

const MoneySourceTable = memo(() => {
  const dispatch = useAppDispatch()
  const {
    moneySources,
    pagination: { page, pageSize, total },
    loading,
    editingMoneySource,
  } = useAppSelector((state: RootState) => state.moneySource)

  useEffect(() => {
    dispatch(getMoneySources({ pagination: { page, pageSize } }))
  }, [dispatch, page, pageSize])

  const handleEdit = (id: number, name: string) => {
    dispatch(startEditing({ id, name }))
  }

  const handleSave = async (id: number) => {
    if (!editingMoneySource) return
    await dispatch(
      updateMoneySource({
        id,
        name: editingMoneySource.name,
      })
    ).unwrap()
    dispatch(getMoneySources({ pagination: { page, pageSize } }))
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const columns: Column<MoneySourceFieldsFragment>[] = [
    {
      header: "Name",
      key: "name",
      render: (moneySource) =>
        editingMoneySource?.id === moneySource.id ? (
          <input
            type="text"
            value={editingMoneySource?.name}
            onChange={(e) => dispatch(startEditing({ ...editingMoneySource, name: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        ) : (
          <div className="text-sm text-gray-900">{moneySource.name}</div>
        ),
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (moneySource) => <div className="text-sm text-gray-900">{formatDate(moneySource.createdAt)}</div>,
    },
    {
      header: "Balance",
      key: "value",
      render: (moneySource) => <div className="text-sm text-gray-900">{formatAmount(moneySource.value)}</div>,
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (moneySource) =>
        editingMoneySource?.id === moneySource.id ? (
          <>
            <button onClick={() => handleSave(moneySource.id)} className="text-indigo-600 hover:text-indigo-900">
              Save
            </button>
            <button onClick={() => dispatch(cancelEditing())} className="ml-2 text-gray-600 hover:text-gray-900">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => handleEdit(moneySource.id, moneySource.name)} className="text-indigo-600 hover:text-indigo-900">
              Edit
            </button>
          </>
        ),
    },
  ]

  return (
    <div>
      <Table<MoneySourceFieldsFragment>
        columns={columns}
        data={moneySources}
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
    </div>
  )
})

MoneySourceTable.displayName = "MoneySourceTable"

export default MoneySourceTable
