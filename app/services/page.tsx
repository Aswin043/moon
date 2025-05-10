"use client";

import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface ServiceRequest {
  id: number;
  name: string;
  unitNumber: string;
  issueType: string;
  description: string;
  status: string;
  date: string;
  timestamp: string;
}

export default function servicec() {
  const { user } = useAuth();
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    unitNumber: "",
    phone: "",
    email: "",
    issueType: "maintenance",
    description: ""
  });

  // Initialize service requests from localStorage or empty array
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const savedRequests = localStorage.getItem('serviceRequests');
      return savedRequests ? JSON.parse(savedRequests) : [];
    }
    return [];
  });

  // Update localStorage whenever serviceRequests changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
    }
  }, [serviceRequests]);

  // Handle form input changes
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    // Create new request with timestamp
    const newRequest = {
      id: Date.now(), // Use timestamp as unique ID
      name: formData.name,
      unitNumber: formData.unitNumber,
      issueType: formData.issueType,
      description: formData.description,
      status: "New",
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };
    
    // Add new request to the beginning of the list
    setServiceRequests([newRequest, ...serviceRequests]);
    
    // Reset form
    setFormData({
      name: "",
      unitNumber: "",
      phone: "",
      email: "",
      issueType: "maintenance",
      description: ""
    });
    
    alert("Service request submitted successfully!");
  };

  // FAQ items
  const faqItems = [
    {
      question: "How quickly will my issue be addressed?",
      answer: "Most maintenance issues are addressed within 24-48 hours of submission. Emergency issues like water leaks are prioritized."
    },
    {
      question: "What qualifies as an emergency?",
      answer: "Water leaks, electrical issues, gas leaks, no heat in winter, security concerns, and complete AC failure in summer."
    },
    {
      question: "Do I need to be present when maintenance arrives?",
      answer: "Unless specified otherwise, we will enter with a master key if you're not home. Please note in your request if you prefer to be present."
    },
    {
      question: "How do I follow up on my request?",
      answer: "You can check the status of your request using your request ID or by calling the management office during business hours."
    },
    {
      question: "Are there any fees for maintenance services?",
      answer: "Standard maintenance is covered by your association fees. However, damages caused by residents may incur additional charges."
    }
  ];

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
      
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-7xl pt-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Service Request</h1>
        
        <div className="flex flex-col lg:flex-row w-full gap-8">
          {/* Left Column - FAQ and Recent Requests */}
          <div className="w-full lg:w-1/3 space-y-8">
            {/* FAQ Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3">
                    <h3 className="font-semibold text-gray-700 mb-1">{item.question}</h3>
                    <p className="text-gray-600 text-sm">{item.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">Need immediate assistance?</h3>
                <p className="text-blue-700 text-sm">For emergencies, please call:</p>
                <p className="text-blue-800 font-bold mt-1">{process.env.NEXT_PUBLIC_COMPANY_PHONE}</p>
              </div>
            </div>

            {/* Recent Requests Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Requests</h2>
              {serviceRequests.length > 0 ? (
                <div className="space-y-4">
                  {serviceRequests.map((request: ServiceRequest) => (
                    <div key={request.id} className="border-b border-gray-200 pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-700">{request.unitNumber}</h3>
                          <p className="text-sm text-gray-600">{request.name}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{request.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No requests submitted yet</p>
              )}
            </div>
          </div>
          
          {/* Right Column - Request Form */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Submit a Service Request</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>
              
              {/* Unit Number */}
              <div>
                <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="unitNumber"
                  name="unitNumber"
                  value={formData.unitNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. A-101"
                />
              </div>
              
              {/* Contact Information - Two columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              {/* Issue Type */}
              <div>
                <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="hvac">HVAC</option>
                  <option value="appliance">Appliance</option>
                  <option value="pest">Pest Control</option>
                  <option value="common-area">Common Area</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description of Issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please describe your issue in detail..."
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}