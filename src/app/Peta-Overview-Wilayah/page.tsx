import PetaOverviewWrapper from './PetaOverviewWrapper'

// Server Component - menggunakan wrapper client component untuk dynamic import
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default function Page() {
  return <PetaOverviewWrapper />
}


