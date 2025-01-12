import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from './components/GoogleAnalytics'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyCursorRules",
  description: "A collection of Cursor AI assistant rules",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
        {
          new Date() >= new Date('2025-01-13') && new Date() < new Date('2025-01-14') && (
            <a
              href="https://www.producthunt.com/posts/mycursorrules?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-mycursorrules"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-4 right-4 z-50"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=776140&theme=neutral&t=1736667490697"
                alt="MyCursorRules - A collection of cursorrules created by developers | Product Hunt"
                style={{ width: '250px', height: '54px' }}
                width="250"
                height="54"
              />
            </a>
          )
        }

      </body>
    </html>
  );
}
