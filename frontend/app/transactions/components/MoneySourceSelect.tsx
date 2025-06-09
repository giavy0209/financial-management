/** @format */

"use client"

import { Fragment, useCallback, useEffect, useState } from "react"
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { client } from "@/lib/apollo-client"
import { gql } from "@apollo/client"
import { MONEY_SOURCE_FIELDS } from "@/store/features/moneySource/moneySourceSlice"

interface MoneySourceSelectProps {
  value: number
  onChange: (value: number) => void
}

interface MoneySource {
  id: number
  name: string
}

const GET_MONEY_SOURCES = gql`
  ${MONEY_SOURCE_FIELDS}
  query GetMoneySources($pagination: PaginationInput) {
    getMoneySources(pagination: $pagination) {
      data {
        ...MoneySourceFields
      }
      pagination {
        total
      }
    }
  }
`

export default function MoneySourceSelect({ value, onChange }: MoneySourceSelectProps) {
  const [query, setQuery] = useState("")
  const [moneySources, setMoneySources] = useState<MoneySource[]>([])
  const [selectedMoneySource, setSelectedMoneySource] = useState<MoneySource | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const loadMoneySources = useCallback(
    async (currentPage: number, append = false) => {
      try {
        setLoading(true)
        const { data } = await client.query({
          query: GET_MONEY_SOURCES,
          variables: {
            pagination: {
              page: currentPage,
              pageSize: 10,
            },
          },
        })

        const newMoneySources = data.getMoneySources.data
        setHasMore(newMoneySources.length === 10)

        if (append) {
          setMoneySources((prev) => [...prev, ...newMoneySources])
        } else {
          setMoneySources(newMoneySources)
        }

        // If the current value exists in the new data, select it
        if (value) {
          const selected = newMoneySources.find((ms: MoneySource) => ms.id === value)
          if (selected) {
            setSelectedMoneySource(selected)
          }
        }
      } catch (error) {
        console.error("Failed to load money sources:", error)
      } finally {
        setLoading(false)
      }
    },
    [value]
  )
  useEffect(() => {
    loadMoneySources(page)
  }, [page, loadMoneySources])

  const filteredMoneySources = query === "" ? moneySources : moneySources.filter((moneySource) => moneySource.name.toLowerCase().includes(query.toLowerCase()))

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      const element = e.target as HTMLElement
      if (element.scrollHeight - element.scrollTop === element.clientHeight && hasMore && !loading) {
        setPage((prev) => {
          const nextPage = prev + 1
          loadMoneySources(nextPage, true)
          return nextPage
        })
      }
    },
    [hasMore, loading, loadMoneySources]
  )

  return (
    <Combobox
      value={selectedMoneySource}
      onChange={(moneySource: MoneySource | null) => {
        setSelectedMoneySource(moneySource)
        onChange(moneySource?.id ?? 0)
      }}
    >
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm">
          <ComboboxInput
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(moneySource: MoneySource) => moneySource?.name || ""}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery("")}>
          <ComboboxOptions
            onScroll={handleScroll}
            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {filteredMoneySources.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">Nothing found.</div>
            ) : (
              filteredMoneySources.map((moneySource) => (
                <ComboboxOption
                  key={moneySource.id}
                  className="relative cursor-default select-none py-2 pl-10 pr-4 ui-active:bg-indigo-600 ui-active:text-white ui-not-active:text-gray-900"
                  value={moneySource}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{moneySource.name}</span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 ui-active:text-white ui-not-active:text-indigo-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
            {loading && <div className="relative cursor-default select-none py-2 px-4 text-gray-700">Loading more money sources...</div>}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  )
}
