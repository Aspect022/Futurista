'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Car, Wrench, TrendingUp, Gauge } from 'lucide-react';

export function DashboardNavbar() {
  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-wide text-black dark:text-white"
          aria-label="Home"
        >
          <div className="h-6 w-6">
            <img 
              src="/logo.jpg" 
              alt="Futurista Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <span>Futurista</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/#features" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/what-if-analysis" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
            What-If Analysis
          </Link>
          <Link href="/reports" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
            Fleet Reports
          </Link>
          <Link href="/appointment-booking" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
            Book Appointment
          </Link>
          <Link href="/dashboard-new" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Fleet Score Card - Always visible in dashboard navbar */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm">
            <Gauge className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">Fleet Health</span>
            <span className="font-bold text-gray-900 dark:text-white">72%</span>
          </div>
          
          <ThemeToggle />
          
          <Link href="/dashboard" className="ml-2">
            <Button className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}