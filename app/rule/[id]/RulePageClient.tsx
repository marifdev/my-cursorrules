'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRules } from '@/app/context/RulesContext'

interface RulePageClientProps {
  id: string
}

export function RulePageClient({ id }: RulePageClientProps) {
  const router = useRouter()
  const { rules, isLoading } = useRules()
  const rule = rules.find(r => r.id === id)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (rule) {
        await navigator.clipboard.writeText(rule.content)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    )
  }

  if (!rule) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-900 p-6 text-white">
        <div className="w-full max-w-2xl rounded-lg border border-red-800 bg-red-900/50 p-4 text-center text-red-200">
          Rule not found
        </div>
        <button
          onClick={() => router.push('/')}
          className="mt-4 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium hover:bg-gray-700"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <main className="flex h-screen flex-col bg-gray-900 text-white">
      <div className="flex-none p-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium hover:bg-gray-700"
            >
              ← Back to Home
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium hover:bg-gray-700"
            >
              {isCopied ? (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6 pt-0">
        <div className="mx-auto h-full max-w-3xl">
          <div className="flex h-full flex-col rounded-lg border border-gray-800 bg-gray-900">
            <div className="flex-none p-8">
              <h1 className="mb-6 text-3xl font-bold">{rule.name}</h1>

              <div className="mb-6 flex flex-wrap gap-2">
                {rule.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-gray-800 px-3 py-1 text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8">
              <div className="pb-8">
                <p className="whitespace-pre-wrap text-gray-300">{rule.content}</p>
              </div>
            </div>

            <div className="flex-none border-t border-gray-800 p-8">
              <div className="flex justify-end">
                <a
                  href={rule.author.contactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-300 hover:text-blue-400 hover:underline"
                >
                  {rule.author.name}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 