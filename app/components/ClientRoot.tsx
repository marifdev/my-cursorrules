'use client'

import { RulesProvider } from '../context/RulesContext'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { RulesList } from './RulesList'
import { useState } from 'react'

export function ClientRoot() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <RulesProvider>
      <main className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-1">
          {/* Mobile sidebar backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 transition-transform duration-300 lg:relative lg:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
          >
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 lg:p-6">
            <RulesList />
          </div>
        </div>
      </main>
    </RulesProvider>
  )
} 