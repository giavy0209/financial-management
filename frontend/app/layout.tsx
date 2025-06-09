/** @format */

import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import MainLayout from "./components/MainLayout"
import { Toaster } from "sonner"
import InitializeUser from "./components/InitializeUser"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Financial Management",
  description: "Manage your finances with ease",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <Providers>
          <InitializeUser />
          <MainLayout>{children}</MainLayout>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  )
}
