"use client"

import { useEffect, useRef } from "react"
import lottie from "lottie-web"
import { Link } from "react-router-dom"
import bookAnimation from "../assets/book-animation.json"

export default function Home() {
  const animationContainer = useRef(null)

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: bookAnimation,
      })

      return () => anim.destroy()
    }
  }, [])

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to <span className="text-blue-600 dark:text-blue-400">Librisys</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              A comprehensive library management solution designed to streamline operations, enhance user experience,
              and simplify resource management for educational institutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Student Login
              </Link>
              <Link
                to="/books"
                className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium rounded-lg border border-blue-600 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Browse Books
              </Link>
            </div>
          </div>
          <div ref={animationContainer} className="h-96 w-full"></div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About LibriSys</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            LibriSys is a state-of-the-art library management system built to meet the evolving needs of modern
            educational institutions. Our platform combines powerful resource management tools with an intuitive user
            interface to create a seamless experience for both students and librarians.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Founded with the mission to digitize and streamline library operations, LibriSys helps institutions manage
            their collections efficiently while providing students with easy access to learning resources. Our system
            handles everything from book cataloging and circulation to user management and reporting.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="features">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">Powerful Features</h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          LibriSys offers a comprehensive suite of features designed to modernize library management and enhance the
          user experience for students and staff alike.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Comprehensive Catalog</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your entire collection with our powerful cataloging system. Add, edit, and organize books with
              detailed metadata, custom categories, and advanced search capabilities.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Seamless Borrowing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our streamlined borrowing process makes it easy for students to request books and for librarians to manage
              loans. Automated reminders help reduce late returns and lost items.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Insightful Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Gain valuable insights with comprehensive reporting tools. Track circulation patterns, popular titles, and
              user activity to make data-driven decisions about your collection.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Secure Access Control</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Role-based access ensures that users only see what they need. Students can browse and borrow, while
              librarians have additional tools for managing the collection and requests.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Automated Workflows</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Save time with automated processes for common tasks like check-ins, check-outs, and overdue notifications.
              Let the system handle routine operations while staff focuses on service.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Integrated Digital Resources</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Manage both physical and digital resources in one place. Link to e-books, journals, and online databases
              to provide a complete library experience for your users.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400 block mb-2">10,000+</span>
            <span className="text-gray-600 dark:text-gray-300">Books Managed</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400 block mb-2">500+</span>
            <span className="text-gray-600 dark:text-gray-300">Institutions</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400 block mb-2">50,000+</span>
            <span className="text-gray-600 dark:text-gray-300">Active Users</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400 block mb-2">99.9%</span>
            <span className="text-gray-600 dark:text-gray-300">Uptime</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 dark:text-blue-400 font-bold">JD</span>
              </div>
              <div>
                <h3 className="font-semibold dark:text-white">Jane Doe</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Head Librarian</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 italic">
              "LibriSys has transformed how we manage our university library. The automated workflows have saved our
              staff countless hours, and students love the easy borrowing process."
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 dark:text-blue-400 font-bold">MS</span>
              </div>
              <div>
                <h3 className="font-semibold dark:text-white">Michael Smith</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 italic">
              "As a student, I love being able to browse books online and place holds. The system is intuitive and makes
              finding research materials so much easier than before."
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 dark:text-blue-400 font-bold">AR</span>
              </div>
              <div>
                <h3 className="font-semibold dark:text-white">Amanda Rodriguez</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">School Administrator</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 italic">
              "The analytics provided by LibriSys have helped us make better decisions about our collection development.
              We now know exactly what resources our students need."
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-blue-600 dark:bg-blue-800 rounded-2xl p-8 md:p-12 text-center text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your library?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of institutions already using LibriSys to streamline their operations and enhance the student
            experience.
          </p>
          <Link
            to="/login"
            className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}
