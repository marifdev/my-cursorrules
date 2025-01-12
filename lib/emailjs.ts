import emailjs from '@emailjs/browser'

interface RuleSubmissionEmail {
  ruleName: string
  authorName: string
  content: string
  categories: string[]
}

export async function sendRuleSubmissionEmail(data: RuleSubmissionEmail) {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        rule_name: data.ruleName,
        author_name: data.authorName,
        content: data.content,
        categories: data.categories.join(', '),
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    )
    return response
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
} 