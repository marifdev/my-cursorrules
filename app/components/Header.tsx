'use client'

import { useState } from 'react'
import Link from 'next/link'

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            mycursorrules
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/submit"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700"
            >
              Submit Your Rule
            </Link>

            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm hover:text-gray-300"
              >
                About
              </button>
            </nav>
          </div>
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-gray-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">About</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="mb-2 text-lg font-semibold">How to Add a .cursorrules File</h3>
                <ol className="list-decimal space-y-2 pl-5 text-gray-300">
                  <li>Create a new file named <code className="rounded bg-gray-800 px-1">.cursorrules</code> in your project root</li>
                  <li>The instructions in the <code className="rounded bg-gray-800 px-1">.cursorrules</code> file will be used for Cursor&apos;s AI</li>
                </ol>
              </section>

              <section>
                <h3 className="mb-2 text-lg font-semibold">How to Submit a Rule</h3>
                <ol className="list-decimal space-y-2 pl-5 text-gray-300">
                  <li>Click the "Submit Rule" button in the header</li>
                  <li>Fill in your rule details including name, content, and categories</li>
                  <li>Add your name and contact URL (Twitter/LinkedIn/GitHub)</li>
                  <li>Submit the form and your rule will be added to the collection after review</li>
                </ol>
              </section>
              {/* madeby link*/}
              <div className="text-center">
                Made by <a href="https://marif.dev" target="_blank" className="text-gray-300 hover:text-gray-300">marif.dev</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 