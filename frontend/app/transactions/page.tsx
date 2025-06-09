/** @format */

"use client"

import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { createTransaction, getTransactions } from "@/store/features/transaction/transactionSlice"
import { getCategories } from "@/store/features/category/categorySlice"
import { getMoneySources } from "@/store/features/moneySource/moneySourceSlice"
import TransactionTable from "./components/TransactionTable"
import { useCallback, useState } from "react"
import Button from "@/app/components/Button"
import FormModal from "@/app/components/FormModal"
import { FormInput, FormCombobox, FormTextArea } from "@/app/components/form"
import { Option } from "@/app/components/form/FormCombobox"

export default function TransactionsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    amount: 0,
    description: "",
    createdAt: new Date(),
    categoryId: 0,
    moneySourceId: 0,
  })

  const loadCategories = useCallback(
    async (page: number): Promise<Option[]> => {
      const result = await dispatch(getCategories({ page, pageSize: 10 })).unwrap()
      if (result.__typename === "CategoryList") {
        return result.data.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      }
      return []
    },
    [dispatch]
  )

  const loadMoneySources = useCallback(
    async (page: number): Promise<Option[]> => {
      const result = await dispatch(getMoneySources({ pagination: { page, pageSize: 10 } })).unwrap()
      if (result.__typename === "MoneySourceList") {
        return result.data.map((source) => ({
          value: source.id,
          label: source.name,
        }))
      }
      return []
    },
    [dispatch]
  )

  const handleCreateTransaction = async () => {
    try {
      setIsSubmitting(true)
      await dispatch(createTransaction(newTransaction)).unwrap()
      setIsModalOpen(false)
      setNewTransaction({
        amount: 0,
        description: "",
        createdAt: new Date(),
        categoryId: 0,
        moneySourceId: 0,
      })
      dispatch(getTransactions({ filter: {}, pagination: { page: 1, pageSize: 10 } }))
    } catch (error) {
      console.error("Failed to create transaction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all transactions in your account.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => setIsModalOpen(true)}>Add Transaction</Button>
        </div>
      </div>

      <div className="mt-8">
        <TransactionTable />
      </div>

      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Transaction" onSubmit={handleCreateTransaction} isSubmitting={isSubmitting}>
        <FormInput
          id="amount"
          type="number"
          label="Amount"
          value={newTransaction.amount}
          onChange={(value) => setNewTransaction({ ...newTransaction, amount: Number(value) })}
          required
        />
        <FormTextArea id="description" label="Description" value={newTransaction.description} onChange={(value) => setNewTransaction({ ...newTransaction, description: value })} />
        <FormInput
          id="date"
          type="date"
          label="Date"
          value={newTransaction.createdAt.toISOString().split("T")[0]}
          onChange={(value) => setNewTransaction({ ...newTransaction, createdAt: new Date(value) })}
          required
        />
        <FormCombobox
          id="categoryId"
          label="Category"
          value={newTransaction.categoryId}
          onChange={(value) => setNewTransaction({ ...newTransaction, categoryId: Number(value) })}
          options={[]}
          loadMore={loadCategories}
          required
        />
        <FormCombobox
          id="moneySourceId"
          label="Money Source"
          value={newTransaction.moneySourceId}
          onChange={(value) => setNewTransaction({ ...newTransaction, moneySourceId: Number(value) })}
          options={[]}
          loadMore={loadMoneySources}
          required
        />
      </FormModal>
    </div>
  )
}
