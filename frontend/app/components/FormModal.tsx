/** @format */
import { ReactNode } from "react"

import Button from "./Button"
import Modal from "./Modal"

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  onSubmit: () => void
  submitLabel?: string
  cancelLabel?: string
  children: ReactNode
  isSubmitting?: boolean
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  onSubmit,
  submitLabel = "Create",
  cancelLabel = "Cancel",
  children,
  isSubmitting = false,
}: FormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">{children}</div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <Button
          onClick={onSubmit}
          className="sm:col-start-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : submitLabel}
        </Button>
        <Button
          onClick={onClose}
          variant="secondary"
          className="sm:col-start-1"
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  )
}
