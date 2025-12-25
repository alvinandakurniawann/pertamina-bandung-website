"use client"

import dynamic from 'next/dynamic'

// Dynamic import dengan ssr: false untuk mencegah SSR error (window is not defined)
const PetaOverviewClient = dynamic(() => import('@/components/PetaOverviewClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat peta...</p>
      </div>
    </div>
  ),
})

export default function PetaOverviewWrapper() {
  return <PetaOverviewClient />
}

