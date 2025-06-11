/** @format */

"use client"

import { useSelector } from "react-redux"

import { RootState } from "@/store/store"

/** @format */

/** @format */

export default function Header() {
  const user = useSelector((state: RootState) => state.user.user)

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-[25%] z-10">
      <div className="h-full px-6 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-sm font-medium text-indigo-700">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {user?.name || "User"}
          </span>
        </div>
      </div>
    </header>
  )
}
