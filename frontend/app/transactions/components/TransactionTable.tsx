/** @format */

"use client"

import { memo, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { getTransactions, updateTransaction, setPage, setPageSize, startEditing, cancelEditing } from "@/store/features/transaction/transactionSlice"
import Table, { Column } from "@/app/components/Table"
import { TransactionFieldsFragment } from "@/graphql/queries"
import CategorySelect from "./CategorySelect"

const PAGE_SIZES = [10, 20, 50]

const TransactionTable = memo(() => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    transactions,
    pagination: { page, pageSize, total },
    loading,
    editingTransaction,
    filters,
  } = useSelector((state: RootState) => state.transaction)

  useEffect(() => {
    dispatch(getTransactions({ filter: filters, pagination: { page, pageSize } }))
  }, [dispatch, page, pageSize, filters])

  const handleEdit = (id: number, description: string | null = "", amount: number, categoryId: number) => {
    dispatch(startEditing({ id, description, amount, categoryId }))
  }

  const handleSave = async (id: number) => {
    try {
      await dispatch(
        updateTransaction({
          id,
          description: editingTransaction.description,
          amount: editingTransaction.amount,
          categoryId: editingTransaction.categoryId,
        })
      ).unwrap()
      dispatch(getTransactions({ filter: filters, pagination: { page, pageSize } }))
    } catch (error: unknown) {
      console.error("Failed to update transaction:", error)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const columns: Column<TransactionFieldsFragment>[] = [
    {
      header: "Description",
      key: "description",
      render: (transaction) =>
        editingTransaction.id === transaction.id ? (
          <input
            type="text"
            value={editingTransaction.description}
            onChange={(e) => dispatch(startEditing({ ...editingTransaction, description: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        ) : (
          <div className="text-sm text-gray-900">{transaction.description}</div>
        ),
    },
    {
      header: "Amount",
      key: "amount",
      align: "right",
      render: (transaction) =>
        editingTransaction.id === transaction.id ? (
          <input
            type="number"
            value={editingTransaction.amount}
            onChange={(e) => dispatch(startEditing({ ...editingTransaction, amount: parseFloat(e.target.value) }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        ) : (
          <div className="text-sm text-gray-900">{formatAmount(transaction.amount)}</div>
        ),
    },
    {
      header: "Category",
      key: "category",
      render: (transaction) =>
        editingTransaction.id === transaction.id ? (
          <div className="w-48">
            <CategorySelect value={editingTransaction.categoryId} onChange={(categoryId) => dispatch(startEditing({ ...editingTransaction, categoryId }))} />
          </div>
        ) : (
          <div className="text-sm text-gray-900">{transaction.category.name}</div>
        ),
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (transaction) => <div className="text-sm text-gray-900">{formatDate(transaction.createdAt)}</div>,
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (transaction) =>
        editingTransaction.id === transaction.id ? (
          <>
            <button onClick={() => handleSave(transaction.id)} className="text-indigo-600 hover:text-indigo-900">
              Save
            </button>
            <button onClick={() => dispatch(cancelEditing())} className="ml-2 text-gray-600 hover:text-gray-900">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleEdit(transaction.id, transaction.description, transaction.amount, transaction.category.id)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Edit
            </button>
          </>
        ),
    },
  ]

  return (
    <div>
      <Table<TransactionFieldsFragment>
        columns={columns}
        data={transactions}
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

TransactionTable.displayName = "TransactionTable"

export default TransactionTable
