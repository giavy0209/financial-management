/** @format */

"use client"

import { useDispatch, useSelector } from "react-redux"

import { useEffect, useRef, useState } from "react"

import { MoneySourceFieldsFragment } from "@/graphql/queries"
import { getMoneySources } from "@/store/features/moneySource/moneySourceSlice"
import { AppDispatch, RootState } from "@/store/store"

/** @format */

/** @format */

/** @format */

/** @format */

interface MoneySourceSelectProps {
  value?: number
  onChange: (moneySourceId: number) => void
}

export default function MoneySourceSelect({
  value,
  onChange,
}: MoneySourceSelectProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [page, setPage] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pageSize = 10

  const { moneySources, pagination, loading } = useSelector(
    (state: RootState) => state.moneySource,
  )
  const selectedMoneySource = moneySources.find((ms) => ms.id === value)

  useEffect(() => {
    dispatch(
      getMoneySources({
        pagination: {
          page,
          pageSize,
        },
      }),
    )
  }, [dispatch, page, pageSize])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      Math.round(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) ===
      e.currentTarget.clientHeight
    if (bottom && !loading && page * pageSize < pagination.total) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white px-4 py-2 text-left border"
      >
        {selectedMoneySource
          ? selectedMoneySource.name
          : "Select a money source"}
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          onScroll={handleScroll}
        >
          {moneySources.map((moneySource: MoneySourceFieldsFragment) => (
            <div
              key={moneySource.id}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white ${
                value === moneySource.id
                  ? "bg-indigo-600 text-white"
                  : "text-gray-900"
              }`}
              onClick={() => {
                onChange(moneySource.id)
                setIsOpen(false)
              }}
            >
              {moneySource.name}
            </div>
          ))}
          {loading && (
            <div className="text-center py-2 text-gray-500">Loading...</div>
          )}
        </div>
      )}
    </div>
  )
}
