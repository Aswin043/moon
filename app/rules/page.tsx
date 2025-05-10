"use client";

import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";


  export default function Rules() {
  const { user } = useAuth();
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
              <li>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                  }}
                  className="hover:text-gray-900 dark:hover:text-white"
                >
                  logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
      
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Building Management Rules</h1>
        
        <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">General Rules</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Quiet hours are from 10:00 PM to 8:00 AM daily. Please be considerate of your neighbors.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>No smoking is allowed inside the building or within 25 feet of any entrance.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Pets must be leashed in all common areas. Pet owners are responsible for immediate cleanup.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Bicycles must be stored in designated areas only, not in hallways or stairwells.</span>
            </li>
          </ul>
        </div>
        
        <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Common Areas</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Residents must clean up after themselves when using common areas.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Community room can be reserved up to 14 days in advance through the management office.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Fitness center is open 24/7. Please wipe down equipment after use.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Swimming pool hours are from 7:00 AM to 10:00 PM. No lifeguard on duty.</span>
            </li>
          </ul>
        </div>
        
        <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Maintenance & Repairs</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>All maintenance requests must be submitted through the resident portal.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Emergency maintenance is available 24/7 by calling the emergency line.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Residents must report water leaks, electrical issues, or pest problems immediately.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Property modifications require written approval from management.</span>
            </li>
          </ul>
        </div>
        
        <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Rent & Payments</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Rent is due on the 1st of each month. Late fees apply after the 5th.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Online payments are preferred through the resident portal.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>A $35 fee will be charged for returned checks or failed electronic payments.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Three-day notice will be issued for unpaid rent after the 10th of the month.</span>
            </li>
          </ul>
        </div>
        
        <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Moving & Deliveries</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Moving must be scheduled with the management office at least 7 days in advance.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Moving hours are between 9:00 AM and 6:00 PM, Monday through Saturday only.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Service elevator must be used for all deliveries and moving activities.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>A refundable deposit of $200 is required for elevator reservation.</span>
            </li>
          </ul>
        </div>
        
        <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Contact Information</h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <p><strong>Management Office:</strong> 555-123-4567</p>
            <p><strong>Email:</strong> management@moonbuilding.com</p>
            <p><strong>Office Hours:</strong> Monday-Friday, 9:00 AM - 5:00 PM</p>
            <p><strong>Emergency Maintenance:</strong> 555-987-6543</p>
          </div>
        </div>
      </main>
    </div>
  );
}