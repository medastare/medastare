import type { Metadata, Viewport } from "next"
import { Inter, Cormorant_Garamond } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "MedaStaré - AI-Powered Beauty & Fashion Ecosystem",
  description:
    "MedaStaré is a luxury AI-powered beauty and fashion ecosystem designed to merge intelligent personalization with elevated digital experience.",
  keywords: [
    "AI beauty",
    "fashion",
    "luxury",
    "styling",
    "MedaStaré",
    "beauty tech",
  ],
  authors: [{ name: "MedaStaré" }],
  openGraph: {
    title: "MedaStaré - AI-Powered Beauty & Fashion Ecosystem",
    description:
      "A luxury AI-powered beauty and fashion ecosystem for elevated digital experience.",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  )
}
