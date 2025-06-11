/** @format */

"use client"

import { useDispatch } from "react-redux"

import { useCallback } from "react"

import Button from "@/app/components/Button"
import FormModal from "@/app/components/FormModal"
import { FormCombobox, FormInput, FormTextArea } from "@/app/components/form"
import { Option } from "@/app/components/form/FormCombobox"
import { config } from "@/config"
import {
  cancelEditing,
  getCategories,
} from "@/store/features/category/categorySlice"
import { getMoneySources } from "@/store/features/moneySource/moneySourceSlice"
import {
  createTransaction,
  getTransactions,
  setEditingTransaction,
  setNewTransaction,
  updateTransaction,
} from "@/store/features/transaction/transactionSlice"
import { useAppSelector } from "@/store/hooks"
import { AppDispatch } from "@/store/store"

import TransactionTable from "./components/TransactionTable"

/** @format */

/** @format */

/** @format */

/** @format */

/** @format */

/** @format */

/** @format */

/** @format */

/** @format */

/** @format */

/** @format */

/** @format */

/** @format */

export default function TransactionsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { editingTransaction, newTransaction, loading } = useAppSelector(
    (state) => state.transaction,
  )

  const loadCategories = useCallback(
    async (page: number): Promise<Option[]> => {
      const result = await dispatch(
        getCategories({ page, pageSize: config.pageSize }),
      ).unwrap()
      if (result.__typename === "CategoryList") {
        return result.data.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      }
      return []
    },
    [dispatch],
  )

  const loadMoneySources = useCallback(
    async (page: number): Promise<Option[]> => {
      const result = await dispatch(
        getMoneySources({ pagination: { page, pageSize: 10 } }),
      ).unwrap()
      if (result.__typename === "MoneySourceList") {
        return result.data.map((source) => ({
          value: source.id,
          label: source.name,
        }))
      }
      return []
    },
    [dispatch],
  )

  const handleCreateTransaction = async () => {
    if (!newTransaction) return

    await dispatch(createTransaction(newTransaction)).unwrap()

    dispatch(
      getTransactions({
        filter: {},
        pagination: {
          page: 1,
          pageSize: 10,
        },
      }),
    )
  }

  const handleEditTransaction = async () => {
    if (!editingTransaction) return
    await dispatch(
      updateTransaction({
        id: editingTransaction.id,
        amount: editingTransaction.amount,
        description: editingTransaction.description,
        createdAt: editingTransaction.createdAt,
        categoryId: editingTransaction.category.id,
        moneySourceId: editingTransaction.moneySource.id,
      }),
    ).unwrap()

    dispatch(cancelEditing())

    dispatch(
      getTransactions({
        filter: {},
        pagination: {
          page: 1,
          pageSize: 10,
        },
      }),
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all transactions in your account.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            onClick={() =>
              dispatch(
                setNewTransaction({
                  amount: 0,
                  description: "",
                  createdAt: new Date().toISOString(),
                  categoryId: 0,
                  moneySourceId: 0,
                }),
              )
            }
          >
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <TransactionTable />
      </div>

      {/* Create Transaction Modal */}
      <FormModal
        isOpen={!!newTransaction}
        onClose={() => dispatch(setNewTransaction(null))}
        title="Create Transaction"
        onSubmit={handleCreateTransaction}
        isSubmitting={loading}
      >
        <FormInput
          id="amount"
          type="number"
          label="Amount"
          value={newTransaction?.amount ?? 0}
          onChange={(value) =>
            dispatch(
              setNewTransaction({ ...newTransaction!, amount: Number(value) }),
            )
          }
          required
        />
        <FormTextArea
          id="description"
          label="Description"
          value={newTransaction?.description ?? ""}
          onChange={(value) =>
            dispatch(
              setNewTransaction({ ...newTransaction!, description: value }),
            )
          }
        />
        <FormInput
          id="date"
          type="date"
          label="Date"
          value={
            newTransaction?.createdAt.split("T")[0] ??
            new Date().toISOString().split("T")[0]
          }
          onChange={(value) =>
            dispatch(
              setNewTransaction({
                ...newTransaction!,
                createdAt: new Date(value).toISOString(),
              }),
            )
          }
          required
        />
        <FormCombobox
          id="categoryId"
          label="Category"
          value={newTransaction?.categoryId ?? 0}
          onChange={(value) =>
            dispatch(
              setNewTransaction({
                ...newTransaction!,
                categoryId: Number(value),
              }),
            )
          }
          options={[]}
          loadMore={loadCategories}
          required
        />
        <FormCombobox
          id="moneySourceId"
          label="Money Source"
          value={newTransaction?.moneySourceId ?? 0}
          onChange={(value) =>
            dispatch(
              setNewTransaction({
                ...newTransaction!,
                moneySourceId: Number(value),
              }),
            )
          }
          options={[]}
          loadMore={loadMoneySources}
          required
        />
      </FormModal>

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <FormModal
          isOpen={!!editingTransaction}
          onClose={() => {
            dispatch(setEditingTransaction(null))
          }}
          title="Edit Transaction"
          onSubmit={handleEditTransaction}
          isSubmitting={loading}
          submitLabel="Save"
        >
          <FormInput
            id="amount"
            type="number"
            label="Amount"
            value={editingTransaction.amount}
            onChange={(value) =>
              dispatch(
                setEditingTransaction({
                  ...editingTransaction,
                  amount: Number(value),
                }),
              )
            }
            required
          />
          <FormTextArea
            id="description"
            label="Description"
            value={editingTransaction.description || ""}
            onChange={(value) =>
              dispatch(
                setEditingTransaction({
                  ...editingTransaction,
                  description: value,
                }),
              )
            }
          />
          <FormInput
            id="date"
            type="date"
            label="Date"
            value={
              new Date(editingTransaction.createdAt).toISOString().split("T")[0]
            }
            onChange={() => {}}
            disabled
            required
          />
          <FormCombobox
            id="categoryId"
            label="Category"
            value={editingTransaction.category.id}
            onChange={(value) =>
              dispatch(
                setEditingTransaction({
                  ...editingTransaction,
                  category: {
                    id: Number(value),
                    name: editingTransaction.category.name,
                  },
                }),
              )
            }
            options={[
              {
                value: editingTransaction.category.id,
                label: editingTransaction.category.name,
              },
            ]}
            loadMore={loadCategories}
            required
          />
          <FormCombobox
            id="moneySourceId"
            label="Money Source"
            value={editingTransaction.moneySource.id}
            onChange={(value) =>
              dispatch(
                setEditingTransaction({
                  ...editingTransaction,
                  moneySource: {
                    id: Number(value),
                    name: editingTransaction.moneySource.name,
                  },
                }),
              )
            }
            options={[
              {
                value: editingTransaction.moneySource.id,
                label: editingTransaction.moneySource.name,
              },
            ]}
            loadMore={loadMoneySources}
            required
          />
        </FormModal>
      )}
    </div>
  )
}
