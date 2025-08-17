import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CryptoInheritance - Secure Blockchain-Based Digital Asset Inheritance',
  description: 'Securely pass your cryptocurrency to verified nominees through on-chain wills and smart contracts',
  keywords: 'cryptocurrency, inheritance, blockchain, digital assets, smart contracts, will, estate planning',
  authors: [{ name: 'CryptoInheritance Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}