"use client"
import Link from 'next/link'
import { SessionProvider } from "next-auth/react" 

export default function Page() {
  return (
              <nav>
            <Link href = "/login">Login    </Link>
          </nav>

  )
}