/** @format */

"use client"

type ConfirmModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmButtonText?: string
  cancelButtonText?: string
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50 top-0 left-0 w-full h-full"></div>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 max-w-md w-full shadow-xl">
        <h2 className="text-lg font-medium text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}
