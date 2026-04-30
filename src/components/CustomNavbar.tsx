"use client";
import React, {useState, useEffect} from 'react';
import {Logo} from "@/components/Logo";
import Link from "next/link";
import {useTheme} from "next-themes";


export const CustomNavbar = () => {
    const [isNavVisible, setNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // This effect handles the logic for showing and hiding the navbar on scroll
    useEffect(() => {
        const controlNavbar = () => {
            // If scrolling down, hide the navbar. If scrolling up, show it.
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) { // Hide after scrolling 100px
                    setNavVisible(false);
                } else {
                    setNavVisible(true);
                }
                // Remember the new scroll position for the next move
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);

            // Cleanup function to remove the event listener
            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md transition-transform duration-300 ease-in-out
          ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`
                }
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href={"/"} className="transition-transform duration-300 ease-in-out">
                            <Logo/>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex items-center space-x-6">
                            <Link href={"/about-me"} className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">About me</Link>

                            {/* Dark mode toggle */}
                            {mounted && (
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    aria-label="Toggle dark mode"
                                    className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    {theme === 'dark' ? (
                                        // Sun icon
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="5"/>
                                            <line x1="12" y1="1" x2="12" y2="3"/>
                                            <line x1="12" y1="21" x2="12" y2="23"/>
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                            <line x1="1" y1="12" x2="3" y2="12"/>
                                            <line x1="21" y1="12" x2="23" y2="12"/>
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                                        </svg>
                                    ) : (
                                        // Moon icon
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};