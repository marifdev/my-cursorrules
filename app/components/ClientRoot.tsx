'use client'

import { RulesProvider } from '../context/RulesContext'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { RulesList } from './RulesList'

export function ClientRoot() {
  return (
    <RulesProvider>
      <main className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6">
            <RulesList />
          </div>
        </div>
      </main>
    </RulesProvider>
  )
} 