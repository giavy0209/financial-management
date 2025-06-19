/** @format */
import { TransactionFieldsFragment } from "@/graphql/queries"
import { GetTransactionInput } from "@/graphql/types"

export interface EditTransaction {
  id: number
  description: string
  amount: number
  category: {
    id: number
    name: string
  }
  moneySource: {
    id: number
    name: string
  }
  createdAt: string
}
export interface TransactionState {
  transactions: TransactionFieldsFragment[]
  summary: number
  pagination: {
    page: number
    pageSize: number
    total: number
  }
  loading: boolean
  editingTransaction: EditTransaction | null
  filters: GetTransactionInput
  newTransaction: {
    amount: number
    description: string
    createdAt: string
    categoryId: number
    moneySourceId: number
  } | null
}
