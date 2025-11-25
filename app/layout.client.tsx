'use client'

import { Suspense } from 'react'

export function SponsorsBannerWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-16" />}>
      {children}
    </Suspense>
  )
}

