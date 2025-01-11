'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { RuleSubmission } from '@/lib/types'

export default function SubmitPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [formData, setFormData] = useState<RuleSubmission>({
    name: '',
    content: '',
    authorName: '',
    contactUrl: '',
    categories: []
  })

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name')

      if (!error && data) {
        setCategories(data.map(c => c.name))
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Rule name is required')
      }
      if (!formData.content.trim()) {
        throw new Error('Rule content is required')
      }
      if (!formData.authorName.trim()) {
        throw new Error('Author name is required')
      }
      if (!formData.contactUrl.trim()) {
        throw new Error('Contact URL is required')
      }
      if (formData.categories.length === 0) {
        throw new Error('At least one category is required')
      }

      // 1. Insert the rule
      const { data: rule, error: ruleError } = await supabase
        .from('rules')
        .insert({
          name: formData.name.trim(),
          content: formData.content.trim(),
          author_name: formData.authorName.trim(),
          author_contact_url: formData.contactUrl.trim(),
        })
        .select()
        .single()

      if (ruleError) {
        console.error('Rule insertion error:', ruleError)
        throw new Error('Failed to create rule. Please try again.')
      }

      if (!rule) {
        throw new Error('Failed to create rule. Please try again.')
      }

      // 2. Create or get categories and create relationships
      try {
        await Promise.all(
          formData.categories.map(async (categoryName) => {
            // First, get or create the category
            const { data: existingCategory, error: fetchError } = await supabase
              .from('categories')
              .select()
              .eq('name', categoryName.trim())
              .single()

            let category
            if (fetchError && fetchError.code === 'PGRST116') {
              // Category doesn't exist, create it
              const { data: newCategory, error: insertError } = await supabase
                .from('categories')
                .insert({ name: categoryName.trim() })
                .select()
                .single()

              if (insertError) {
                console.error('Category insertion error:', insertError)
                throw new Error('Failed to create category: ' + categoryName)
              }
              category = newCategory
            } else if (fetchError) {
              console.error('Category fetch error:', fetchError)
              throw new Error('Failed to check category: ' + categoryName)
            } else {
              category = existingCategory
            }

            if (!category) {
              throw new Error('Failed to create or fetch category: ' + categoryName)
            }

            // Then create the relationship
            const { error: relationError } = await supabase
              .from('rule_categories')
              .insert({
                rule_id: rule.id,
                category_id: category.id,
              })

            if (relationError) {
              console.error('Relationship creation error:', relationError)
              throw new Error('Failed to link category: ' + categoryName)
            }
          })
        )
      } catch (categoryError) {
        // If category creation fails, delete the rule to maintain consistency
        await supabase.from('rules').delete().eq('id', rule.id)
        throw categoryError
      }

      router.push('/')
      router.refresh() // Refresh the page to show the new rule
    } catch (err) {
      console.error('Error submitting rule:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(category)
      return {
        ...prev,
        categories: isSelected
          ? prev.categories.filter(c => c !== category)
          : [...prev.categories, category]
      }
    })
  }

  const handleAddCategory = () => {
    if (!newCategory.trim()) return

    // Split by commas and clean up each category
    const categoryNames = newCategory
      .split(',')
      .map(cat => cat.trim())
      .filter(cat => cat.length > 0)

    // Add each category
    categoryNames.forEach(categoryName => {
      if (!categories.includes(categoryName)) {
        setCategories(prev => [...prev, categoryName].sort())
      }
      if (!formData.categories.includes(categoryName)) {
        setFormData(prev => ({
          ...prev,
          categories: [...prev.categories, categoryName]
        }))
      }
    })

    setNewCategory('')
  }

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(newCategory.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Submit Your Rule</h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-900/50 p-4 text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Rule Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Rule Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="h-64 w-full rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Your Name
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Contact URL (Twitter/LinkedIn)
            </label>
            <input
              type="url"
              value={formData.contactUrl}
              onChange={(e) => setFormData({ ...formData, contactUrl: e.target.value })}
              className="w-full rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Categories
            </label>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Search or add new categories"
                    className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim()}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Tip: You can add multiple categories at once by separating them with commas (e.g., 'TypeScript, React, Next.js')
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {filteredCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${formData.categories.includes(category)
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            {formData.categories.length === 0 && (
              <p className="mt-2 text-sm text-red-500">
                Please select at least one category
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || formData.categories.length === 0}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Rule'}
          </button>
        </form>
      </div>
    </main>
  )
} 