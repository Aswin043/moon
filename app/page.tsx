"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { user, userName } = useAuth();
  // Location-based notification states
  const [country, setCountry] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Time-based greeting states
  const [greeting, setGreeting] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [showGreeting, setShowGreeting] = useState(false); // Initialize to false

  useEffect(() => {
    // Time-based greeting logic
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      
      // Format time as HH:MM
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setLocalTime(formattedTime);

      // Set appropriate greeting based on time of day
      if (hour >= 5 && hour < 12) {
        setGreeting("Good morning");
        setTimeOfDay("morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good afternoon");
        setTimeOfDay("afternoon");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Good evening");
        setTimeOfDay("evening");
      } else {
        setGreeting("Good night");
        setTimeOfDay("night");
      }
    };

    // Initial greeting update
    updateGreeting();
    
    // Make greeting appear immediately
    setShowGreeting(true);
    
    // Update greeting every minute
    const intervalId = setInterval(updateGreeting, 60000);
    
    // Make greeting disappear after 15 seconds
    const greetingTimerId = setTimeout(() => {
      setShowGreeting(false);
    }, 15000);

    // Location notification logic
    // Check if notification was previously dismissed in this session
    const isDismissed = localStorage.getItem("notificationDismissed") === "true";
    
    if (isDismissed) {
      setLoading(false);
    } else {
      // FOR TESTING ON LOCALHOST - This will ensure the notification shows
      const useTestData = true; // Set to false for real API usage
      
      if (useTestData) {
        // Add a small delay to make sure the notification appears after page load
        setTimeout(() => {
          setCountry("Australia");
          setNotificationMessage("Welcome to Moon Strata Management! We provide expert services across Sydney.");
          setShowNotification(true);
          setLoading(false);
        }, 500); // 500ms delay
      } else {
        // Function to get user's location and determine country
        const getUserLocation = async () => {
          try {
            // Get user's IP-based geolocation
            const response = await fetch("https://ipapi.co/json/");
            const data = await response.json();
            setCountry(data.country_name);
            
            // Check if the country is one of our targeted countries
            if (data.country_name === "Australia") {
              setNotificationMessage("Welcome to Moon Strata Management! We provide expert services across Sydney.");
              setShowNotification(true);
            } else if (data.country_name === "New Zealand") {
              setNotificationMessage("Kia ora! Moon Strata Management is now offering services to New Zealand properties.");
              setShowNotification(true);
            } else if (data.country_name === "Singapore") {
              setNotificationMessage("Hello from Moon! We're expanding our strata management services to Singapore.");
              setShowNotification(true);
            }
          } catch (error) {
            console.error("Error fetching location:", error);
          } finally {
            setLoading(false);
          }
        };

        getUserLocation();
      }
    }
    
    // Clear localStorage on component mount (for testing purposes)
    // Comment this out in production
    localStorage.removeItem("notificationDismissed");
    
    // Clean up intervals and timers on unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(greetingTimerId);
    };
  }, []);

  // Ensure user is upserted into the user table after login (for Google sign-in and others)
  useEffect(() => {
    if (user) {
      (async () => {
        const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        await supabase.from('user').upsert({
          id: user.id,
          email: user.email,
          name,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      })();
    }
  }, [user]);

  const closeNotification = () => {
    setShowNotification(false);
    // Store in local storage to prevent showing again in the same session
    localStorage.setItem("notificationDismissed", "true");
  };

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
      
      {/* Time-based Greeting - will disappear after 15 seconds */}
      {showGreeting && (
        <div className="fixed top-20 left-4 max-w-sm bg-white dark:bg-gray-800 border-l-4 border-blue-500 p-4 rounded shadow-lg z-40 animate-slide-in">
          <div className="flex flex-col">
            <p className="font-medium text-gray-800 dark:text-white">
              {greeting}! Welcome to Moon Management
            </p>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
              Local time: {localTime}
            </p>
            {timeOfDay === "morning" && (
              <p className="text-sm mt-2 text-blue-600">Start your day with Moon.</p>
            )}
            {timeOfDay === "afternoon" && (
              <p className="text-sm mt-2 text-blue-600">Need help with your property this afternoon?</p>
            )}
            {timeOfDay === "evening" && (
              <p className="text-sm mt-2 text-blue-600">Winding down for the day? We're still here.</p>
            )}
            {timeOfDay === "night" && (
              <p className="text-sm mt-2 text-blue-600">Submit inquiries anytime - we'll follow up tomorrow.</p>
            )}
          </div>
        </div>
      )}
      
      {/* Location-based Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 max-w-sm bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-lg z-50 animate-slide-in">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <p className="font-medium">{notificationMessage}</p>
              <p className="text-sm mt-1">Location: {country}</p>
            </div>
            <button 
              onClick={closeNotification}
              className="text-blue-500 hover:text-blue-700 ml-4"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
          <div className="mt-2">
            <button className="text-sm text-blue-600 hover:text-blue-800 underline">
              Learn More
            </button>
          </div>
        </div>
      )}
      
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start min-h-[calc(100vh-200px)]">
        <div className="relative w-full">
          <Image
            src="/heropic.jpg"
            alt="heropic"
            width={1368}
            height={793}
            priority
            className="hero-image"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="hero-text">STRATA MANAGEMENT</h1>
          </div>
          <div className="rec-aboutus">
            <h1 className="boutus">.aboutUS</h1>
            <p className="aboutus-text">
            We are Moon, a Strata Manager based in Sydney we offer expert services to ensure seamless property operations and resident satisfaction. We specialize in maintenance, compliance, and fostering strong communities.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="w-full bg-gray-50 dark:bg-gray-900 py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {process.env.NEXT_PUBLIC_COMPANY_NAME}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Professional strata management services across {process.env.NEXT_PUBLIC_COMPANY_ADDRESS}.
            </p>
            <div className="flex space-x-4">
              <a href={`tel:${process.env.NEXT_PUBLIC_COMPANY_PHONE}`} className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
                {process.env.NEXT_PUBLIC_COMPANY_PHONE}
              </a>
              <a href={`mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL}`} className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
                {process.env.NEXT_PUBLIC_COMPANY_EMAIL}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Community Portal
                </Link>
              </li>
              <li>
                <Link href="/rules" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Strata Rules
                </Link>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Office Hours</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p>Saturday: 9:00 AM - 1:00 PM</p>
              <p>Sunday: Closed</p>
              <p className="mt-2">Emergency: {process.env.NEXT_PUBLIC_EMERGENCY_SUPPORT}</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_COMPANY_NAME}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Add animation for notification slide-in */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}