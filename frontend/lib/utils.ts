/** @format */
import { toast } from "sonner"

import { ErrorOutput } from "@/graphql/types"

type GraphQLResponse = {
  message: string[] | string
  statusCode: string
}

export const handleGraphQLMessage = (response: unknown) => {
  if (!response || typeof response !== "object") return

  const gqlResponse = response as GraphQLResponse
  if ("message" in gqlResponse) {
    const message = Array.isArray(gqlResponse.message)
      ? gqlResponse.message.join(", ")
      : gqlResponse.message

    toast.success(message)
  }
}

export const handleGraphQLError = (
  error: unknown,
  title = "Error",
  fallbackMessage = "An unexpected error occurred",
) => {
  if (!error) {
    toast.error(title, {
      description: fallbackMessage,
    })
    return
  }

  // Handle GraphQL ErrorOutput type
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = Array.isArray((error as ErrorOutput).message)
      ? (error as ErrorOutput).message.join(", ")
      : (error as { message: string }).message

    toast.error(title, {
      description: message,
    })
    return
  }

  // Handle Error instance
  if (error instanceof Error) {
    toast.error(title, {
      description: error.message,
    })
    return
  }

  // Fallback for unknown error types
  toast.error(title, {
    description: fallbackMessage,
  })
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
