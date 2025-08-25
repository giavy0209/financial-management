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
        <Script>
          {`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KJCFFKW7');
`}
        </Script>
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KJCFFKW7"
            height="0"
            width="0"
            style={{ display: "none" }}
          ></iframe>
        </noscript>
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
