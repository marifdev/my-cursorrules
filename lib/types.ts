export interface Rule {
  id: string
  name: string
  content: string
  author: {
    name: string
    contactUrl: string
  }
  categories: string[]
  createdAt: string
}

export interface RuleSubmission {
  name: string
  content: string
  authorName: string
  contactUrl: string
  categories: string[]
} 