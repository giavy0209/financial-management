/** @format */

"use client"

import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { createMoneySource, getMoneySources } from "@/store/features/moneySource/moneySourceSlice"
import MoneySourceTable from "./components/MoneySourceTable"
import { useState } from "react"
import Button from "@/app/components/Button"
import FormModal from "@/app/components/FormModal"
import { FormInput } from "@/app/components/form"

export default function MoneySourcesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newMoneySource, setNewMoneySource] = useState({
    name: "",
  })

  const handleCreateMoneySource = async () => {
    try {
      setIsSubmitting(true)
      await dispatch(createMoneySource(newMoneySource)).unwrap()
      setIsModalOpen(false)
      setNewMoneySource({
        name: "",
      })
      dispatch(getMoneySources({ pagination: { page: 1, pageSize: 10 } }))
    } catch (error) {
      console.error("Failed to create money source:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Money Sources</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all money sources in your account.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => setIsModalOpen(true)}>Add Money Source</Button>
        </div>
      </div>

      <div className="mt-8">
        <MoneySourceTable />
      </div>

      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Money Source" onSubmit={handleCreateMoneySource} isSubmitting={isSubmitting}>
        <FormInput id="name" label="Name" value={newMoneySource.name} onChange={(value) => setNewMoneySource({ ...newMoneySource, name: value.toString() })} required />
      </FormModal>
    </div>
  )
}
