/** @format */

"use client"

import { useState } from "react"
import { HomeIcon, BanknotesIcon, TagIcon, WalletIcon, ChartBarIcon, DocumentChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useDispatch } from "react-redux"
import { logout } from "@/store/features/user/userSlice"
import { AppDispatch } from "@/store/store"
import { toast } from "sonner"
import { classNames } from "@/lib/utils"
import ConfirmModal from "./ConfirmModal"

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Transactions", href: "/transactions", icon: BanknotesIcon },
  { name: "Categories", href: "/categories", icon: TagIcon },
  { name: "Money Sources", href: "/money-sources", icon: WalletIcon },
  { name: "Budget", href: "/budget", icon: ChartBarIcon },
  { name: "Reports", href: "/reports", icon: DocumentChartBarIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    try {
      dispatch(logout())
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error: unknown) {
      console.error("Logout error:", error)
      toast.error("Failed to logout. Please try again.")
    }
  }

  return (
    <>
      <div className="flex h-screen">
        {/* Static sidebar */}
        <div className="w-[300px] inset-y-0 z-50 flex flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <h1 className="text-2xl font-bold text-gray-900">Financial Manager</h1>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            pathname === item.href ? "bg-gray-50 text-indigo-600" : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(pathname === item.href ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-600", "h-6 w-6 shrink-0")}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmButtonText="Logout"
      />
    </>
  )
}
