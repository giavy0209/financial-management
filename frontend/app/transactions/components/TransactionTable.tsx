/** @format */

"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { getTransactions, updateTransaction, deleteTransaction, setPage, setPageSize, startEditing, cancelEditing } from "@/store/features/transaction/transactionSlice"
import Table, { Column } from "@/app/components/Table"
import { Transaction } from "@/graphql/types"

const PAGE_SIZES = [10, 20, 50]

export default function TransactionTable() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    transactions,
    pagination: { page, pageSize, total },
    loading,
    editingTransaction,
  } = useSelector((state: RootState) => state.transaction)

  useEffect(() => {
    dispatch(getTransactions({ page, pageSize }))
  }, [dispatch, page, pageSize])

  const handleEdit = (id: number, name: string, amount: number, date: string) => {
    dispatch(startEditing({ id, name, amount, date }))
  }

  const handleSave = async (id: number) => {
    try {
      await dispatch(updateTransaction({ id, name: editingTransaction.name, amount: editingTransaction.amount, date: editingTransaction.date })).unwrap()
      dispatch(getTransactions({ page, pageSize }))
    } catch (error: unknown) {
      console.error("Failed to update transaction:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteTransaction({ id })).unwrap()
      dispatch(getTransactions({ page, pageSize }))
    } catch (error: unknown) {
      console.error("Failed to delete transaction:", error)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const columns: Column<Transaction>[] = [
    {
      header: "Name",
      key: "name",
      render: (transaction) =>
        editingTransaction.id === transaction.id ? (
          <input
            type="text"
            value={editingTransaction.name}
            onChange={(e) => dispatch(startEditing({ ...editingTransaction, name: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        ) : (
          <div className="text-sm text-gray-900">{transaction.name}</div>
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
      header: "Date",
      key: "date",
      render: (transaction) =>
        editingTransaction.id === transaction.id ? (
          <input
            type="date"
            value={editingTransaction.date}
            onChange={(e) => dispatch(startEditing({ ...editingTransaction, date: e.target.value }))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        ) : (
          <div className="text-sm text-gray-900">{formatDate(transaction.date)}</div>
        ),
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
            <button onClick={() => dispatch(cancelEditing())} className="text-gray-600 hover:text-gray-900">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => handleEdit(transaction.id, transaction.name, transaction.amount, transaction.date)} className="text-indigo-600 hover:text-indigo-900">
              Edit
            </button>
            <button onClick={() => handleDelete(transaction.id)} className="text-red-600 hover:text-red-900">
              Delete
            </button>
          </>
        ),
    },
  ]

  return (
    <Table<Transaction>
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
  )
}
