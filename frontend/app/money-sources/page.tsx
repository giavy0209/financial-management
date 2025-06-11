/** @format */

"use client"

import { useDispatch } from "react-redux"

import Button from "@/app/components/Button"
import FormModal from "@/app/components/FormModal"
import { FormInput } from "@/app/components/form"
import {
  createMoneySource,
  getMoneySources,
  setNewMoneySource,
} from "@/store/features/moneySource/moneySourceSlice"
import { useAppSelector } from "@/store/hooks"
import { AppDispatch } from "@/store/store"

import MoneySourceTable from "./components/MoneySourceTable"

/** @format */

/** @format */

export default function MoneySourcesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const {
 newMoneySource, loading 
} = useAppSelector((state) => state.moneySource,)

  const handleCreateMoneySource = async () => {
    if (!newMoneySource) return
    await dispatch(createMoneySource(newMoneySource)).unwrap()
    dispatch(getMoneySources({
 pagination: {
 page: 1,
pageSize: 10 
} 
}))
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Money Sources</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all money sources in your account.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            onClick={() => dispatch(setNewMoneySource({
 name: "",
value: 0 
}))}
          >
            Add Money Source
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <MoneySourceTable />
      </div>

      <FormModal
        isOpen={!!newMoneySource}
        onClose={() => dispatch(setNewMoneySource(null))}
        title="Create Money Source"
        onSubmit={handleCreateMoneySource}
        isSubmitting={loading}
      >
        <FormInput
          id="name"
          label="Name"
          value={newMoneySource?.name}
          onChange={(value) =>
            dispatch(setNewMoneySource({
 ...newMoneySource,
name: value.toString() 
}),)
          }
          required
        />
        <FormInput
          id="value"
          type="number"
          label="Value"
          value={newMoneySource?.value}
          onChange={(value) =>
            dispatch(setNewMoneySource({
 ...newMoneySource,
value: Number(value) 
}),)
          }
          required
        />
      </FormModal>
    </div>
  )
}
