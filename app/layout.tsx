"use client"
import Link from 'next/link'
import { SessionProvider } from "next-auth/react" 
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SessionProvider>

          {children}
        </SessionProvider>
      </body>
    </html>
  )
}