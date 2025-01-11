import { RulePageClient } from './RulePageClient'

interface PageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function RulePage({ params }: PageProps) {
  return <RulePageClient id={params.id} />
} 