/** @format */

import { TextareaHTMLAttributes } from "react"
import { classNames } from "@/lib/utils"

interface FormTextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  id?: string
  label: string
  error?: string
  helperText?: string
  onChange: (value: string) => void
  rows?: number
}

export default function FormTextArea({ id, label, error, helperText, className = "", required, disabled, placeholder, value, onChange, rows = 3, ...props }: FormTextAreaProps) {
  const textareaClasses = classNames(
    "mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
    error ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500" : "",
    disabled ? "bg-gray-50 text-gray-500" : "",
    className
  )

  const renderHelperText = () => {
    if (error) {
      return (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error}
        </p>
      )
    }
    if (helperText) {
      return (
        <p className="mt-2 text-sm text-gray-500" id={`${id}-description`}>
          {helperText}
        </p>
      )
    }
    return null
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        className={textareaClasses}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-description` : undefined}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        {...props}
      />
      {renderHelperText()}
    </div>
  )
}
