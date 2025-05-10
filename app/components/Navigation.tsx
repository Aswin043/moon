"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { cookieManager } from "@/lib/cookies";
import { useEffect } from "react";

export default function Navigation() {
  const { user, userName } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Set last visit cookie when component mounts
  useEffect(() => {
    cookieManager.setLastVisit();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md rounded-b-lg px-6 py-4 flex justify-between items-center z-50">
      <div className="text-lg font-semibold text-gray-800 dark:text-white">
        .moon
      </div>
      <ul className="flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 items-center">
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
          <Link href="/services" className="hover:text-gray-900 dark:hover:text-white">
            services
          </Link>
        </li>
        <li>
          <Link href="/rules" className="hover:text-gray-900 dark:hover:text-white">
            rules
          </Link>
        </li>
        <li>
          <a href="/api/owners.php" className="hover:text-gray-900 dark:hover:text-white">
            owners
          </a>
        </li>
        <li>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </li>
        {!user ? (
          <li>
            <Link href="/login" className="hover:text-gray-900 dark:hover:text-white">
              login
            </Link>
          </li>
        ) : (
          <>
            <li className="font-semibold text-blue-700 dark:text-blue-300">
              Welcome, {userName || 'User'}!
            </li>
            <li>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  // Clear user preferences on logout
                  cookieManager.remove('user_preferences');
                }}
                className="hover:text-gray-900 dark:hover:text-white"
              >
                logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
} 