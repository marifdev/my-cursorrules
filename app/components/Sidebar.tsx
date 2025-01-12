'use client'

import { useEffect, useState } from 'react'
import { useRules } from '../context/RulesContext'
import { supabase } from '@/lib/supabase'

interface CategoryCount {
  name: string
  count: number
}

interface CategoryData {
  name: string
  rule_categories: Array<{
    rule_id: string
    rules: {
      id: string
      is_active: boolean
    } | null
  }> | null
}

export function Sidebar() {
  const { selectedCategory, setSelectedCategory } = useRules()
  const [categories, setCategories] = useState<CategoryCount[]>([])
  const [totalRules, setTotalRules] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Get total active rules count
        const { count: rulesCount } = await supabase
          .from('rules')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)

        setTotalRules(rulesCount || 0)

        // Get categories with their counts for active rules
        const { data: categoryCounts, error } = await supabase
          .from('categories')
          .select(`
            name,
            rule_categories:rule_categories!left (
              rule_id,
              rules:rules!left (
                id,
                is_active
              )
            )
          `)
          .order('name')

        if (error) throw error

        const formattedCategories = (categoryCounts as unknown as CategoryData[] || []).map((category) => ({
          name: category.name,
          count: category.rule_categories?.reduce((acc, rc) =>
            acc + (rc.rules?.is_active ? 1 : 0), 0
          ) || 0
        }))

        setCategories(formattedCategories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <aside className="w-64 border-r border-gray-800 h-full flex flex-col">
        <div className="p-6">
          <div className="h-8 animate-pulse rounded-lg bg-gray-800 mb-4" />
          <nav className="space-y-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-8 animate-pulse rounded-lg bg-gray-800"
              />
            ))}
          </nav>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 border-r border-gray-800 h-full flex flex-col">
      <div className="flex-none p-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm ${selectedCategory === null ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
        >
          <span>All Categories</span>
          <span className="ml-2 text-gray-500">{totalRules}</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-6 pb-6 space-y-1">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`w-full flex items-center rounded-lg px-3 py-2 text-sm ${selectedCategory === category.name ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <span className="flex-1 text-left">{category.name}</span>
            <span className="ml-2 text-gray-500">{category.count}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
} 