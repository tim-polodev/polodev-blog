"use client";
import React, {useState, useEffect} from 'react';
import {Logo} from "@/components/Logo";
import Link from "next/link";


export const CustomNavbar = () => {
    const [isNavVisible, setNavVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

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
                className={`fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-md transition-transform duration-300 ease-in-out
          ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`
                }
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link href={"/"} className="transition-transform duration-300 ease-in-out">
                            <Logo/>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex items-center space-x-8">
                            <Link href={"/about-me"} className="text-gray-600 hover:text-blue-600 font-medium">About me</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};