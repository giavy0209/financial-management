/** @format */
import { Toaster } from "sonner"

import { Inter } from "next/font/google"
import Script from "next/script"

import InitializeUser from "./components/InitializeUser"
import MainLayout from "./components/MainLayout"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata = {
  title: "Financial Management",
  description: "Manage your finances with ease",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TJ71FEXH3Z"
        ></Script>
        <Script>
          {`
    window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-TJ71FEXH3Z');
    `}
        </Script>
      </head>
      <body
        suppressHydrationWarning={true}
        className={inter.className}
      >
        <Providers>
          <InitializeUser />
          <MainLayout>{children}</MainLayout>
          <Toaster
            richColors
            position="top-right"
          />
        </Providers>
      </body>
    </html>
  )
}
