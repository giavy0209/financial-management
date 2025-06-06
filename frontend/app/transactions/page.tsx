/** @format */

"use client"

import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { createTransaction, getTransactions } from "@/store/features/transaction/transactionSlice"
import TransactionTable from "./components/TransactionTable"
import { useState } from "react"
import Modal from "@/app/components/Modal"

export default function TransactionsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    name: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  })

  const handleCreateTransaction = async () => {
    try {
      await dispatch(createTransaction(newTransaction)).unwrap()
      setIsModalOpen(false)
      setNewTransaction({
        name: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
      })
      dispatch(getTransactions({ page: 1, pageSize: 10 }))
    } catch (error: unknown) {
      console.error("Failed to create transaction:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all transactions in your account.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Transaction
          </button>
        </div>
      </div>

      <div className="mt-8">
        <TransactionTable />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Transaction">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={newTransaction.name}
              onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            onClick={handleCreateTransaction}
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}
