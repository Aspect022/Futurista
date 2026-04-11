'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Menu, X } from 'lucide-react';

interface UnifiedNavbarProps {
  includeFleetScore?: boolean;
  fleetHealth?: number;
}

export function UnifiedNavbar({ includeFleetScore = false, fleetHealth = 48 }: UnifiedNavbarProps) {
  const [open, setOpen] = useState(false);
  const isVisible = useScrollReveal(80);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm"
          aria-label="Primary"
        >
          <nav className="mx-auto max-w-7xl px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold tracking-wide text-black dark:text-white"
              aria-label="Home"
              onClick={() => setOpen(false)}
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
              <Link href="/dashboard-new" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                My Car
              </Link>
              <Link href="/what-if-analysis" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                Road Trip Check
              </Link>
              <Link href="/appointment-booking" className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                Book a Mechanic
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {/* Car Status Pill — replaces Fleet Health Score */}
              {includeFleetScore && (
                <Link href="/vehicle/car-3/predictive-maintenance" className="hidden md:flex items-center gap-2 bg-red-50 dark:bg-red-900/30 rounded-lg px-3 py-2 text-sm border border-red-200 dark:border-red-800">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-medium text-red-700 dark:text-red-300">Toyota Innova — {fleetHealth}% ⚠️</span>
                </Link>
              )}
              
              <ThemeToggle />
              
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  aria-label="Toggle menu"
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                  className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => setOpen((v) => !v)}
                >
                  <span className="sr-only">Toggle menu</span>
                  {open ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
              
              <Link href="/dashboard-new" className="ml-2 hidden md:block">
                <Button className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Check My Car
                </Button>
              </Link>
            </div>
          </nav>

          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95"
              >
                <div className="px-4 py-3 flex flex-col gap-2">
                  <Link href="/" className="py-2 text-sm text-gray-700 dark:text-gray-300" onClick={() => setOpen(false)}>
                    Home
                  </Link>
                  <Link href="/dashboard-new" className="py-2 text-sm text-gray-700 dark:text-gray-300" onClick={() => setOpen(false)}>
                    My Car
                  </Link>
                  <Link href="/what-if-analysis" className="py-2 text-sm text-gray-700 dark:text-gray-300" onClick={() => setOpen(false)}>
                    Road Trip Check
                  </Link>
                  <Link href="/appointment-booking" className="py-2 text-sm text-gray-700 dark:text-gray-300" onClick={() => setOpen(false)}>
                    Book a Mechanic
                  </Link>
                  <Link href="/dashboard-new" onClick={() => setOpen(false)} className="mt-2">
                    <Button className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-200">Check My Car</Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}