/** @format */
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
  Transition,
} from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

import { Fragment, useCallback, useEffect, useState } from "react"

import { classNames } from "@/lib/utils"

export interface Option {
  value: string | number
  label: string
}

interface FormComboboxProps {
  id?: string
  label: string
  value: Option["value"]
  onChange: (value: Option["value"]) => void
  options: Option[]
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  className?: string
  loadMore?: (page: number) => Promise<Option[]>
}

export default function FormCombobox({
  id,
  label,
  value,
  onChange,
  options: initialOptions,
  error,
  helperText,
  required,
  disabled,
  placeholder,
  className = "",
  loadMore,
}: FormComboboxProps) {
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState(initialOptions)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const inputClasses = classNames(
    "mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
    error
      ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
      : "",
    disabled ? "bg-gray-50 text-gray-500" : "",
    className,
  )
  useEffect(() => {
    if (loadMore) {
      setLoading(true)
      loadMore(page).then((newOptions) => {
        setOptions((prev) => {
          const filteredOptions = newOptions.filter(
            (option) => !prev.some((o) => o.value === option.value),
          )
          return [...prev, ...filteredOptions]
        })
        setHasMore(newOptions.length > 0)
        setLoading(false)
      })
    }
  }, [page, loadMore])
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      if (!loadMore) return

      const element = e.target as HTMLElement
      if (
        element.scrollHeight - element.scrollTop <= element.clientHeight + 50 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1)
      }
    },
    [hasMore, loading, loadMore],
  )

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase()),
        )

  const renderHelperText = () => {
    if (error) {
      return (
        <p
          className="mt-2 text-sm text-red-600"
          id={`${id}-error`}
        >
          {error}
        </p>
      )
    }
    if (helperText) {
      return (
        <p
          className="mt-2 text-sm text-gray-500"
          id={`${id}-description`}
        >
          {helperText}
        </p>
      )
    }
    return null
  }

  const selectedOption = options.find((option) => option.value === value) || {
    value: "",
    label: "",
  }
  return (
    <Combobox
      as="div"
      value={selectedOption}
      onChange={(option: Option) => onChange(option?.value || "")}
      disabled={disabled}
    >
      <Label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative mt-1">
        <ComboboxInput
          className={inputClasses}
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option: Option) => option?.label ?? ""}
          placeholder={placeholder}
          id={id}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2 ">
          <ChevronDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxButton>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <ComboboxOptions
            onScroll={handleScroll}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="relative cursor-pointer select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <ComboboxOption
                  key={option.value}
                  value={option}
                  className="relative cursor-pointer select-none py-2 pl-3 pr-9 ui-active:bg-indigo-600 ui-active:text-white ui-not-active:text-gray-900 hover:bg-gray-100"
                >
                  {option.label}
                </ComboboxOption>
              ))
            )}
            {loading && (
              <div className="relative cursor-pointer select-none py-2 px-4 text-gray-700">
                Loading more options...
              </div>
            )}
          </ComboboxOptions>
        </Transition>
      </div>
      {renderHelperText()}
    </Combobox>
  )
}
