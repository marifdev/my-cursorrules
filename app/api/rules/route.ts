import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type RuleCategoryJoin = Database['public']['Tables']['rule_categories']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row']
}

type RuleWithCategories = Database['public']['Tables']['rules']['Row'] & {
  rule_categories: RuleCategoryJoin[]
}

export async function GET() {
  try {
    const { data: rules, error: rulesError } = await supabase
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

    const transformedRules = (rules as RuleWithCategories[]).map(rule => ({
      id: rule.id,
      name: rule.name,
      content: rule.content,
      author: {
        name: rule.author_name,
        contactUrl: rule.author_contact_url,
        avatarUrl: rule.author_avatar_url,
      },
      categories: rule.rule_categories.map(rc => rc.categories.name),
      createdAt: rule.created_at,
      isActive: rule.is_active,
    }))

    return NextResponse.json(transformedRules)
  } catch (error) {
    console.error('Error fetching rules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rules' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, content, authorName, contactUrl, avatarUrl, categories } = body

    const { data: rule, error: ruleError } = await supabase
      .from('rules')
      .insert({
        name,
        content,
        author_name: authorName,
        author_contact_url: contactUrl,
        author_avatar_url: avatarUrl,
      })
      .select()
      .single()

    if (ruleError) throw ruleError

    const categoryPromises = categories.map(async (categoryName: string) => {
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .upsert({ name: categoryName })
        .select()
        .single()

      if (categoryError) throw categoryError
      return category
    })

    const createdCategories = await Promise.all(categoryPromises)

    const relationshipPromises = createdCategories.map(category =>
      supabase
        .from('rule_categories')
        .insert({
          rule_id: rule.id,
          category_id: category.id,
        })
    )

    await Promise.all(relationshipPromises)

    const { data: completeRule, error: fetchError } = await supabase
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
      .eq('id', rule.id)
      .single()

    if (fetchError) throw fetchError

    const transformedRule = {
      id: completeRule.id,
      name: completeRule.name,
      content: completeRule.content,
      author: {
        name: completeRule.author_name,
        contactUrl: completeRule.author_contact_url,
        avatarUrl: completeRule.author_avatar_url,
      },
      categories: (completeRule as RuleWithCategories).rule_categories.map(rc => rc.categories.name),
      createdAt: completeRule.created_at,
    }

    return NextResponse.json(transformedRule)
  } catch (error) {
    console.error('Error creating rule:', error)
    return NextResponse.json(
      { error: 'Failed to create rule' },
      { status: 500 }
    )
  }
} 