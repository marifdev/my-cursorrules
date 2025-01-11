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
  }>
}

export function Sidebar() {
  const { selectedCategory, setSelectedCategory } = useRules()
  const [categories, setCategories] = useState<CategoryCount[]>([])
  const [totalRules, setTotalRules] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Get total rules count
        const { count: rulesCount } = await supabase
          .from('rules')
          .select('*', { count: 'exact', head: true })

        setTotalRules(rulesCount || 0)

        // Get categories with their counts
        const { data: categoryCounts, error } = await supabase
          .from('categories')
          .select(`
            name,
            rule_categories!inner (
              rule_id
            )
          `)
          .order('name')

        if (error) throw error

        const formattedCategories = (categoryCounts as CategoryData[]).map(category => ({
          name: category.name,
          count: new Set(category.rule_categories.map(rc => rc.rule_id)).size
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
      <aside className="w-64 border-r border-gray-800 p-6 h-full">
        <nav className="space-y-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-8 animate-pulse rounded-lg bg-gray-800"
            />
          ))}
        </nav>
      </aside>
    )
  }

  return (
    <aside className="w-64 border-r border-gray-800 p-6">
      <nav className="space-y-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm ${selectedCategory === null ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
        >
          <span>All Categories</span>
          <span className="text-gray-500">{totalRules}</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm ${selectedCategory === category.name ? 'bg-gray-800' : 'hover:bg-gray-800'
              }`}
          >
            <span>{category.name}</span>
            <span className="text-gray-500">{category.count}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
} 