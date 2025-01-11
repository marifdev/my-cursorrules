import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          cursor.rules
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            href="/submit"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700"
          >
            Submit Rule
          </Link>

          <nav className="flex items-center space-x-4">
            <Link href="/about" className="text-sm hover:text-gray-300">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 