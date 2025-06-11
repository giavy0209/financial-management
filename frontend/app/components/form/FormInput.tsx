/** @format */
import { InputHTMLAttributes } from "react"

import { classNames } from "@/lib/utils"

interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  id?: string
  label: string
  error?: string
  helperText?: string
  type?: "text" | "number" | "date" | "email" | "password" | "tel" | "url"
  onChange: (value: string | number) => void
}

export default function FormInput({
  id,
  label,
  error,
  helperText,
  type = "text",
  className = "",
  required,
  disabled,
  placeholder,
  value,
  onChange,
  ...props
}: FormInputProps) {
  const inputClasses = classNames(
    "p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
    error
      ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
      : "",
    disabled ? "bg-gray-50 text-gray-500" : "",
    className,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      type === "number" ? Number(e.target.value) || 0 : e.target.value

    onChange(newValue)
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        className={inputClasses}
        value={value?.toString() ?? "0"}
        onChange={handleChange}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-description` : undefined
        }
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        {...props}
      />
      {renderHelperText()}
    </div>
  )
}
