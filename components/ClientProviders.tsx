'use client'

import { SessionProvider } from "next-auth/react"
import { useEffect } from "react"
import ClientErrorBoundary from "@/components/ClientErrorBoundary"

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  // Removed manual theme class logic. next-themes will handle theme switching and persistence.

  return (
    <SessionProvider>
      <ClientErrorBoundary>
        {children}
      </ClientErrorBoundary>
    </SessionProvider>
  )
}