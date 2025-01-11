'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Rule } from '@/lib/types'
import { useRules } from '../context/RulesContext'

function truncateText(text: string, maxLength: number = 150) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function RulesList() {
  const router = useRouter()
  const { selectedCategory } = useRules()
  const [allRules, setAllRules] = useState<Rule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (e: React.MouseEvent, content: string, id: string) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  useEffect(() => {
    async function fetchRules() {
      try {
        const response = await fetch('/api/rules')
        if (!response.ok) {
          throw new Error('Failed to fetch rules')
        }
        const data = await response.json()
        setAllRules(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rules')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRules()
  }, [])

  const filteredRules = selectedCategory
    ? allRules.filter(rule => rule.categories.includes(selectedCategory))
    : allRules

  useEffect(() => {
    function updateVisibleCategories() {
      const cards = document.querySelectorAll('[data-rule-id]')
      const newVisibleCategories: { [key: string]: number } = {}

      cards.forEach((card) => {
        const ruleId = card.getAttribute('data-rule-id')
        if (!ruleId) return

        const container = card.querySelector('.categories-container')
        if (!container) return

        const containerWidth = container.clientWidth
        let totalWidth = 0
        let visibleCount = 0

        const categories = card.querySelectorAll('.category-item')
        categories.forEach((category) => {
          totalWidth += (category as HTMLElement).offsetWidth + 8 // 8px for gap
          if (totalWidth <= containerWidth - 70) { // Leave space for "+X more"
            visibleCount++
          }
        })

        newVisibleCategories[ruleId] = visibleCount
      })
    }

    updateVisibleCategories()
    window.addEventListener('resize', updateVisibleCategories)
    return () => window.removeEventListener('resize', updateVisibleCategories)
  }, [filteredRules])

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

  if (filteredRules.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8 text-center text-gray-400">
        No rules found. Be the first to submit one!
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
      {filteredRules.map((rule) => (
        <div
          key={rule.id}
          data-rule-id={rule.id}
          onClick={() => router.push(`/rule/${rule.id}`)}
          className="group cursor-pointer rounded-lg border border-gray-800 bg-gray-900 p-4 sm:p-6 transition-all hover:border-gray-700 hover:bg-gray-800"
        >
          <div className="mb-3 sm:mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base sm:text-lg font-semibold">{rule.name}</h3>
              <button
                onClick={(e) => handleCopy(e, rule.content, rule.id)}
                className="relative -mr-1 p-1.5 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-gray-800"
              >
                {copiedId === rule.id ? (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-gray-800 text-xs whitespace-nowrap">
                    Copied!
                  </div>
                ) : null}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
            <p className="whitespace-pre-wrap text-sm text-gray-400">
              {truncateText(rule.content, window.innerWidth < 640 ? 100 : 150)}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5 sm:gap-2 min-h-[28px] items-center">
              {rule.categories.slice(0, window.innerWidth < 640 ? 2 : 4).map((category) => (
                <span
                  key={category}
                  className="category-item rounded-full bg-gray-800/80 px-2 py-0.5 sm:px-3 sm:py-1 text-xs text-gray-300 transition-colors group-hover:bg-gray-700"
                >
                  {category}
                </span>
              ))}
              {rule.categories.length > (window.innerWidth < 640 ? 2 : 4) && (
                <div className="relative group/tooltip">
                  <span className="rounded-full bg-gray-800/80 px-2 py-0.5 sm:px-3 sm:py-1 text-xs text-gray-300 transition-colors group-hover:bg-gray-700 cursor-help">
                    +{rule.categories.length - (window.innerWidth < 640 ? 2 : 4)} more
                  </span>
                  <div className="absolute bottom-full left-0 mb-2 hidden w-max max-w-[calc(100vw-2rem)] group-hover/tooltip:block z-10">
                    <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg p-2.5 shadow-xl border border-gray-700">
                      <div className="flex flex-wrap gap-1.5">
                        {rule.categories.slice(window.innerWidth < 640 ? 2 : 4).map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-gray-700/80 px-2 py-0.5 text-xs text-gray-300 whitespace-nowrap"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <a
                href={rule.author.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-300 hover:text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {rule.author.name}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 