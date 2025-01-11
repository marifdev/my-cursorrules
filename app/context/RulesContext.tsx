'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Rule } from '../types'

const mockRules: Rule[] = [
  {
    id: '1',
    name: 'TypeScript Expert',
    content: `You are an expert in TypeScript, React Native, Expo, and Mobile UI development.

Code Style and Structure:
- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs.`,
    author: {
      name: 'John Doe',
      contactUrl: 'https://twitter.com/johndoe',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    categories: ['TypeScript', 'React Native', 'Expo'],
    createdAt: new Date()
  },
  // Add more mock rules here
]

interface RulesContextType {
  rules: Rule[]
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  filteredRules: Rule[]
}

const RulesContext = createContext<RulesContextType | undefined>(undefined)

export function RulesProvider({ children }: { children: ReactNode }) {
  const [rules] = useState<Rule[]>(mockRules)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredRules = selectedCategory
    ? rules.filter(rule => rule.categories.includes(selectedCategory))
    : rules

  return (
    <RulesContext.Provider
      value={{
        rules,
        selectedCategory,
        setSelectedCategory,
        filteredRules
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