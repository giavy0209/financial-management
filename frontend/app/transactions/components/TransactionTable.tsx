"use client"

import { useDispatch, useSelector } from "react-redux"

import { memo, useEffect } from "react"

import Table, { Column } from "@/app/components/Table"
import { TransactionFieldsFragment } from "@/graphql/queries"
import { formatAmount, formatDate } from "@/lib/utils"
import {
  getSummary,
  getTransactions,
  setEditingTransaction,
  setPage,
  setPageSize,
} from "@/store/features/transaction/transactionSlice"
import { AppDispatch, RootState } from "@/store/store"

const PAGE_SIZES = [10, 20, 50]

const TransactionTable = memo(() => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    transactions,
    pagination: { page, pageSize, total },
    loading,
    filters,
    summary,
  } = useSelector((state: RootState) => state.transaction)

  useEffect(() => {
    dispatch(
      getTransactions({
        filter: filters,
        pagination: {
          page,
          pageSize,
        },
      }),
    )
  }, [dispatch, page, pageSize, filters])

  useEffect(() => {
    dispatch(getSummary({ filter: filters }))
  }, [dispatch, filters])

  const onEdit = (transaction: TransactionFieldsFragment) => {
    dispatch(
      setEditingTransaction({
        id: transaction.id,
        description: transaction.description || "",
        amount: transaction.amount,
        category: transaction.category,
        moneySource: transaction.moneySource,
        createdAt: transaction.createdAt,
      }),
    )
  }

  const columns: Column<TransactionFieldsFragment>[] = [
    {
      header: "Description",
      key: "description",
      render: (transaction) => (
        <div className="text-sm text-gray-900">{transaction.description}</div>
      ),
    },
    {
      header: "Amount",
      key: "amount",
      align: "right",
      render: (transaction) => (
        <div className="text-sm text-gray-900">
          {formatAmount(transaction.amount)}
        </div>
      ),
    },
    {
      header: "Category",
      key: "category",
      render: (transaction) => (
        <div className="text-sm text-gray-900">{transaction.category.name}</div>
      ),
    },
    {
      header: "Money Source",
      key: "moneySource",
      render: (transaction) => (
        <div className="text-sm text-gray-900">
          {transaction.moneySource.name}
        </div>
      ),
    },
    {
      header: "Created At",
      key: "createdAt",
      render: (transaction) => (
        <div className="text-sm text-gray-900">
          {formatDate(transaction.createdAt)}
        </div>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      align: "right",
      render: (transaction) => (
        <button
          onClick={() => onEdit(transaction)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
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
      <div className="text-sm text-gray-900 p-4 bg-white">
        Total: {formatAmount(summary)}
      </div>
    </div>
  )
})

TransactionTable.displayName = "TransactionTable"

export default TransactionTable
