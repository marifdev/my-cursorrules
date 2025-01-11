'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Rule } from '@/lib/types'

function truncateText(text: string, maxLength: number = 150) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function RulesList() {
  const router = useRouter()
  const [rules, setRules] = useState<Rule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRules() {
      try {
        const response = await fetch('/api/rules')
        if (!response.ok) {
          throw new Error('Failed to fetch rules')
        }
        const data = await response.json()
        setRules(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rules')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRules()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-800 bg-red-900/50 p-4 text-center text-red-200">
        {error}
      </div>
    )
  }

  if (rules.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8 text-center text-gray-400">
        No rules found. Be the first to submit one!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rules.map((rule) => (
        <div
          key={rule.id}
          onClick={() => router.push(`/rule/${rule.id}`)}
          className="cursor-pointer rounded-lg border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700 hover:bg-gray-800"
        >
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold">{rule.name}</h3>
            <p className="whitespace-pre-wrap text-sm text-gray-400">
              {truncateText(rule.content)}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {rule.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-gray-800 px-3 py-1 text-xs"
                >
                  {category}
                </span>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium">{rule.author.name}</p>
              <a
                href={rule.author.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()} // Prevent card click when clicking the link
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 