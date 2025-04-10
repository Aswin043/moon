// app/not-found.js (or app/not-found.tsx for TypeScript)
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Navigation Bar */}
      <div className="nav-container">
        <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md rounded-b-lg px-6 py-4 flex justify-between items-center z-50">
          <div className="text-lg font-semibold text-gray-800 dark:text-white">
            .moon
          </div>
          <ul className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <li>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-gray-900 dark:hover:text-white">
                community
              </Link>
            </li>
            <li>
              <Link href="#about" className="hover:text-gray-900 dark:hover:text-white">
                services
              </Link>
            </li>
            <li>
              <Link href="#contact" className="hover:text-gray-900 dark:hover:text-white">
                rules
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      <main className="flex flex-col gap-6 row-start-2 items-center justify-center w-full max-w-2xl text-center">
        <div className="text-6xl font-bold text-gray-800 dark:text-white">404</div>
        <h1 className="text-3xl font-semibold text-gray-700 dark:text-gray-200">Page Not Found</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Link href="/" className="px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
            Return to Home
          </Link>
        </div>
        
        {/* Optional: Show suggested links */}
        <div className="mt-12 w-full">
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">You might be looking for:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/community" className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition-shadow">
              <div className="font-medium text-gray-800 dark:text-white">Community</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Connect with other residents</div>
            </Link>
            <Link href="/rules" className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition-shadow">
              <div className="font-medium text-gray-800 dark:text-white">Rules</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Building management rules</div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}