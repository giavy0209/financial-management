/** @format */

"use client"

import { useDispatch } from "react-redux"

import { useState } from "react"

import Button from "@/app/components/Button"
import FormModal from "@/app/components/FormModal"
import { FormInput } from "@/app/components/form"
import {
  createCategory,
  getCategories,
} from "@/store/features/category/categorySlice"
import { AppDispatch } from "@/store/store"

/** @format */

/** @format */

export default function CreateCategoryButton() {
  const dispatch = useDispatch<AppDispatch>()
  const [
isModalOpen,
setIsModalOpen
] = useState(false)
  const [
isSubmitting,
setIsSubmitting
] = useState(false)
  const [
newCategory,
setNewCategory
] = useState({
    name: "",
  })

  const handleCreateCategory = async () => {
    try {
      setIsSubmitting(true)
      await dispatch(createCategory(newCategory)).unwrap()
      setIsModalOpen(false)
      setNewCategory({
        name: "",
      })
      dispatch(getCategories({
 page: 1,
pageSize: 10 
}))
    } catch (error) {
      console.error(
"Failed to create category:",
error
)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Add Category</Button>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Category"
        onSubmit={handleCreateCategory}
        isSubmitting={isSubmitting}
      >
        <FormInput
          id="name"
          label="Name"
          value={newCategory.name}
          onChange={(value) =>
            setNewCategory({
 ...newCategory,
name: value.toString() 
})
          }
          required
        />
      </FormModal>
    </>
  )
}
