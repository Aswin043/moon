"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from "@/lib/supabase";
import { useAuth } from "../context/AuthContext";

// Define the notice type
interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  date: Date;
  author: string;
  isPinned: boolean;
}

// Inline NoticeBoard component
function NoticeBoard() {
  // Sample notice data
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: '1',
      title: 'System Maintenance',
      content: 'The system will be down for maintenance on Saturday from 2-4 PM.',
      category: 'Announcement',
      date: new Date('2025-04-08'),
      author: 'IT Department',
      isPinned: true,
    },
    {
      id: '2',
      title: 'Team Meeting',
      content: 'Weekly team meeting is rescheduled to Tuesday at 10 AM.',
      category: 'Meeting',
      date: new Date('2025-04-06'),
      author: 'Management',
      isPinned: false,
    },
    {
      id: '3',
      title: 'New Project Launch',
      content: 'We are excited to announce the launch of our new project next month.',
      category: 'Project',
      date: new Date('2025-04-10'),
      author: 'Project Team',
      isPinned: true,
    },
    {
      id: '4',
      title: 'Office Closure',
      content: 'The office will be closed on April 15 for a public holiday.',
      category: 'Announcement',
      date: new Date('2025-04-12'),
      author: 'HR Department',
      isPinned: false,
    },
  ]);

  // State for filtering and active category
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Get all unique categories
  const categories = ['All', ...Array.from(new Set(notices.map(notice => notice.category)))];

  // Filter notices based on active category
  const filteredNotices = activeCategory && activeCategory !== 'All'
    ? notices.filter(notice => notice.category === activeCategory)
    : notices;

  // Sort notices - pinned first, then by date
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notice Board</h1>
      
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === category 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(category === 'All' ? null : category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Notices */}
      <div className="space-y-4">
        {sortedNotices.map(notice => (
          <div 
            key={notice.id}
            className={`border rounded-lg p-4 transition-all ${
              notice.isPinned 
                ? 'border-l-4 border-l-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                {notice.isPinned && (
                  <svg 
                    className="w-4 h-4 text-blue-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.6,3.4c0.4-0.4,1-0.4,1.4,0l5.6,5.6c0.4,0.4,0.4,1,0,1.4L11,16l-4-4L3.4,10.6c-0.4-0.4-0.4-1,0-1.4L9.6,3.4z M11,6 c-0.6,0-1,0.4-1,1s0.4,1,1,1s1-0.4,1-1S11.6,6,11,6z" />
                  </svg>
                )}
                {notice.title}
              </h3>
              <span className="bg-gray-100 text-xs font-medium text-gray-600 px-2.5 py-0.5 rounded-full">
                {notice.category}
              </span>
            </div>
            
            <p className="mt-2 text-gray-600">{notice.content}</p>
            
            <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
              <span>By {notice.author}</span>
              <span>{format(new Date(notice.date), 'MMM d, yyyy')}</span>
            </div>
          </div>
        ))}
        
        {sortedNotices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No notices found
          </div>
        )}
      </div>
    </div>
  );
}

// Members component
function Members() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        console.log('Fetching members from profile table...');
        
        const { data, error } = await supabase
          .from('user')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('Supabase response:', { data, error });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log('No members found in profile table');
          setError('No members found');
        } else {
          console.log('Members found:', data);
          setMembers(data);
        }
      } catch (error: any) {
        console.error('Error fetching members:', error);
        setError(error.message || 'Failed to fetch members');
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Members</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Members</h2>
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">
                {member.name?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {member.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Community() {
  const { user, userName } = useAuth();
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
                      window.location.reload();
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
      </div>
      
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-4xl">
        <NoticeBoard />
        <Members />
      </main>
    </div>
  );
}