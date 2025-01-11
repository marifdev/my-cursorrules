import { RulePageClient } from './RulePageClient'
import { RulesProvider } from '@/app/context/RulesContext'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RulePage({ params }: Props) {
  const resolvedParams = await params
  return (
    <RulesProvider>
      <RulePageClient id={resolvedParams.id} />
    </RulesProvider>
  )
} 