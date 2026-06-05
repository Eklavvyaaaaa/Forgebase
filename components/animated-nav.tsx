'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

interface AnimatedNavProps {
  user: any;
}

export function AnimatedNav({ user }: AnimatedNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      clipPath: 'circle(0% at 100% 0%)',
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    open: {
      opacity: 1,
      clipPath: 'circle(150% at 100% 0%)',
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const linkVariants = {
    closed: { y: 20, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.1 * i + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    })
  };

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Colleges', href: '/colleges' },
    { name: 'Compare', href: '/compare' },
    { name: 'Rank Predictor', href: '/predictor' },
    { name: 'Swipe Discover', href: '/discover' }
  ];

  return (
    <>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="hidden sm:flex items-center gap-4 mr-4">
             <span className="text-sm font-medium text-gray-700">{user.email}</span>
             <form action="/auth/signout" method="post">
                <Button variant="outline" type="submit" size="sm" className="text-gray-700">
                  Log out
                </Button>
             </form>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 mr-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        )}

        <button 
          onClick={toggleMenu}
          className="relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-[6px] rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <motion.div 
            animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className={`w-6 h-[2px] ${isOpen ? 'bg-white' : 'bg-black'} rounded-full origin-center transition-colors duration-300`}
          />
          <motion.div 
            animate={isOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
            className={`w-6 h-[2px] ${isOpen ? 'bg-white' : 'bg-black'} rounded-full transition-colors duration-300`}
          />
          <motion.div 
            animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className={`w-6 h-[2px] ${isOpen ? 'bg-white' : 'bg-black'} rounded-full origin-center transition-colors duration-300`}
          />
        </button>
      </div>

      {isMounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed inset-0 z-40 bg-gray-950 flex flex-col items-center justify-center"
            >
              <nav className="flex flex-col items-center gap-8">
                {links.map((link, i) => (
                  <motion.div key={link.name} custom={i} variants={linkVariants}>
                    <Link 
                      href={link.href} 
                      className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div 
                custom={links.length} 
                variants={linkVariants}
                className="absolute bottom-12 flex flex-col items-center gap-6"
              >
                {user ? (
                  <form action="/auth/signout" method="post">
                    <Button variant="outline" type="submit" className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white px-8">
                      Log out
                    </Button>
                  </form>
                ) : (
                  <div className="flex gap-4">
                     <Button variant="outline" asChild className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white px-8">
                       <Link href="/login">Log in</Link>
                     </Button>
                     <Button asChild className="bg-white text-black hover:bg-gray-200 px-8">
                       <Link href="/signup">Sign up</Link>
                     </Button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
