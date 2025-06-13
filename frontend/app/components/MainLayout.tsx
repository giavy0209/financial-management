/** @format */

"use client"

import { usePathname } from "next/navigation"

import Header from "./Header"
import Sidebar from "./Sidebar"

/** @format */

/** @format */

/** @format */

/** @format */

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="p-8 mt-16 flex-1">{children}</main>
    </div>
  )
}
