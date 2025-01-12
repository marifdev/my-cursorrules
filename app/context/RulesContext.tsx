'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Rule } from '../types'
import { supabase } from '@/lib/supabase'

interface RulesContextType {
  rules: Rule[]
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  filteredRules: Rule[]
  isLoading: boolean
  error: string | null
}

const RulesContext = createContext<RulesContextType | undefined>(undefined)

export function RulesProvider({ children }: { children: ReactNode }) {
  const [rules, setRules] = useState<Rule[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRules() {
      try {
        const { data: rulesData, error: rulesError } = await supabase
          .from('rules')
          .select(`
            *,
            rule_categories (
              category_id,
              categories (
                name
              )
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (rulesError) throw rulesError

        const transformedRules = rulesData.map(rule => ({
          id: rule.id,
          name: rule.name,
          content: rule.content,
          author: {
            name: rule.author_name,
            contactUrl: rule.author_contact_url,
          },
          categories: rule.rule_categories.map((rc: { categories: { name: string } }) => rc.categories.name),
          createdAt: rule.created_at,
          isActive: rule.isActive,
        }))

        setRules(transformedRules)
      } catch (err) {
        console.error('Error fetching rules:', err)
        setError('Failed to fetch rules')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRules()
  }, [])

  const filteredRules = selectedCategory
    ? rules.filter(rule => rule.categories.includes(selectedCategory))
    : rules

  return (
    <RulesContext.Provider
      value={{
        rules,
        selectedCategory,
        setSelectedCategory,
        filteredRules,
        isLoading,
        error
      }}
    >
      {children}
    </RulesContext.Provider>
  )
}

export function useRules() {
  const context = useContext(RulesContext)
  if (context === undefined) {
    throw new Error('useRules must be used within a RulesProvider')
  }
  return context
} 