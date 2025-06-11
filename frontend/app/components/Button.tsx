/** @format */
import { ButtonHTMLAttributes } from "react"

import { classNames } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = "primary",
  size = "sm",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-base",
  }

  const width = fullWidth ? "w-full" : ""

  return (
    <button
      className={classNames(
        baseStyles,
        variants[variant],
        sizes[size],
        width,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
