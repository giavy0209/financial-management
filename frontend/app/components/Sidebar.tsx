/** @format */

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useDispatch } from "react-redux"
import { logout } from "@/store/features/user/userSlice"
import { AppDispatch } from "@/store/store"
import { toast } from "sonner"
import { useState } from "react"
import ConfirmModal from "./ConfirmModal"

const navigation = [
  { name: "Categories", href: "/categories" },
  { name: "Transactions", href: "/transactions" },
  { name: "Budget", href: "/budget" },
  { name: "Reports", href: "/reports" },
  { name: "Settings", href: "/settings" },
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
      <div className="h-screen w-1/4 bg-white border-r border-gray-200 fixed left-0 top-0">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Financial Manager</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
              Logout
            </button>
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
