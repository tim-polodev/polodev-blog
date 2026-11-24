"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { CustomNavbar } from "@/components/CustomNavbar";
import { calculateExperienceYears, formatExperienceYears } from "@/utils";

const CAREER_START_YEAR = 2019;
const CAREER_START_MONTH = 2;
const DEFAULT_EXPERIENCE_YEARS = 7;

const certifications = [
    {
        title: "Kubestronaut",
        badgeId: "226cb096-3ae0-49e9-82e2-a390ba775d9d",
    },
    {
        title: "Kubernetes and Cloud Native Associate",
        badgeId: "c8d3d61d-aa34-492d-9124-645989352191",
    },
    {
        title: "Kubernetes and Cloud Native Security Associate",
        badgeId: "cf6d1bd6-e567-4102-9655-1d0871a4c64a",
    },
    {
        title: "Certified Kubernetes Administrator",
        badgeId: "82f115a3-73f5-4c4e-92a2-ad21dd8cda99",
    },
    {
        title: "Certified Kubernetes Application Developer",
        badgeId: "21e2ac23-ef0b-49b6-bcd7-fcfca504a930",
    },
    {
        title: "Certified Kubernetes Security Specialist",
        badgeId: "c11e24ef-dc8a-4f43-b23f-766202fa94f4",
    },
    {
        title: "Professional Cloud DevOps Engineer",
        badgeId: "9a08aecc-1072-41d4-91bc-04a8e9f2d335",
    },
    {
        title: "Professional Machine Learning Engineer",
        badgeId: "3b6b6aa5-5425-42f1-a804-c2e4c6061fcc",
    },
    {
        title: "AWS Solutions Architect Associate",
        badgeId: "66c140c3-c105-4b91-be83-ba77743e8831",
    },
    {
        title: "Certified Partner Specialist Gemini Enterprise Agent Development",
        badgeId: "766dd33b-7a5d-419b-b6d8-028ec6ce1000",
    },
    {
        title: "Deploy an Agent with Agent Development Kit (ADK)",
        badgeId: "da525198-9e06-497b-b714-2b3adca0c0b1",
    },
    {
        title: "Evaluate and Improve Agent Development Kit Agents",
        badgeId: "a3f6ea3a-9bda-4b3d-8527-bff270bba5b2",
    },
    {
        title: "Accelerate Development with Antigravity",
        badgeId: "ea28463b-dd91-48f5-ab46-bc5d330eec34",
    },
    {
        title: "Generative AI Leader Certification",
        badgeId: "dbbb93d8-b47e-4aee-a1a3-b1fca1fea690",
    },
    {
        title: "Reinvention with Agentic AI",
        badgeId: "26c30a0c-9500-4731-b2d5-aeff36b4c346",
    },
];

export default function AboutMe() {
    const [showAwardImage, setShowAwardImage] = useState(false);
    // Keep initial render deterministic across SSR/static prerender and update on mount.
    const [experienceYears, setExperienceYears] = useState<number>(DEFAULT_EXPERIENCE_YEARS);

    useEffect(() => {
        setExperienceYears(calculateExperienceYears(CAREER_START_YEAR, CAREER_START_MONTH));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <CustomNavbar />
            <Script src="//cdn.credly.com/assets/utilities/embed.js" strategy="lazyOnload" />
            <main className="container mx-auto px-4 py-8 pt-28">
                <div className="max-w-3xl mx-auto space-y-12">

                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">Hoàng Thành Tiến</h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">Tim / Polodev</p>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">Software Engineer /
                            DevSecOps / Kubestronaut</p>
                        <p className="text-gray-500 dark:text-gray-400 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"
                                className="w-5 h-5 shrink-0 mx-auto sm:mx-0"
                                aria-label="Accenture">
                                <defs>
                                    <linearGradient id="accenture-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#A100FF" />
                                        <stop offset="100%" stopColor="#FF0078" />
                                    </linearGradient>
                                </defs>
                                <polygon points="10,5 35,25 10,45 18,45 43,25 18,5" fill="url(#accenture-gradient)" />
                            </svg>
                            Fullstack Engineering Associate Manager at Accenture Song
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>🇻🇳 Vietnamese</span>
                            <span>📍 Jakarta, Indonesia · Hanoi, Vietnam</span>
                            <a href="mailto:hoangthanhtien0604@gmail.com"
                                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                ✉️ hoangthanhtien0604@gmail.com
                            </a>
                            <a href="https://www.linkedin.com/in/hoangthanhtien"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-[#0077B5] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
                                    <path
                                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                LinkedIn
                            </a>
                        </div>
                    </div>

                    {/* About */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">About</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                            I am a Software Engineer and Solutions Architect with {formatExperienceYears(experienceYears)} of experience building
                            resilient, high-traffic distributed systems. I specialize in the intersection of Media
                            Streaming and AdTech, where I&apos;ve engineered platforms that serve hundreds of millions
                            of end users in Indonesia, processing billions of requests per month with very low latency.
                        </p>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Core Technical
                                Arsenal</p>
                            <ul className="space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
                                <li><span className="font-medium">Specializations:</span> Video/Audio Streaming,
                                    OpenRTB, Ad-Serving Platforms, High-Availability Systems
                                </li>
                                <li><span className="font-medium">Cloud & Infrastructure:</span> AWS (Certified
                                    Architect), Azure, GCP (Certified ML & DevOps Pro), Huawei Cloud, Kubernetes
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Experience */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b dark:border-gray-700 pb-2">Experience</h2>
                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700" />

                            <div className="space-y-8">

                                {/* Accenture */}
                                <div className="relative pl-12">
                                    <div
                                        className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-purple-500 flex items-center justify-center shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="w-4 h-4"
                                            aria-label="Accenture">
                                            <defs>
                                                <linearGradient id="acc-tl" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#A100FF" />
                                                    <stop offset="100%" stopColor="#FF0078" />
                                                </linearGradient>
                                            </defs>
                                            <polygon points="10,5 35,25 10,45 18,45 43,25 18,5" fill="url(#acc-tl)" />
                                        </svg>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">Full Stack Engineering Assoc
                                        Manager</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Accenture ·
                                        Full-time</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">May 2024 – Present ·
                                        Jakarta, Indonesia ·
                                        Hybrid</p>
                                </div>

                                {/* Jixie */}
                                <div className="relative pl-12">
                                    <div
                                        className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-300">JX</span>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">Head of Media</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Jixie ·
                                        Full-time</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">Aug 2023 – May 2024 · 10 mos
                                        · Hanoi, Vietnam ·
                                        Remote</p>
                                </div>

                                {/* VMO Group */}
                                <div className="relative pl-12">
                                    <div
                                        className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-orange-400 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-orange-500">VMO</span>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">VMO Group</p>

                                    <div
                                        className="mt-3 space-y-4 border-l-2 border-gray-100 dark:border-gray-700 pl-4 ml-1">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Technical
                                                Team Lead</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Apr 2023 – Aug
                                                2023 · 5 mos ·
                                                Hanoi, Vietnam · On-site</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Full-stack
                                                Developer</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">Sep 2021 – Apr 2023
                                                · 1 yr 8 mos ·
                                                Hanoi, Vietnam</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Gonstack */}
                                <div className="relative pl-12">
                                    <div
                                        className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-300">GS</span>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">Back End Developer</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Gonstack ·
                                        Full-time</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">Feb 2019 – Sep 2021 · 2 yrs
                                        8 mos · Hanoi,
                                        Vietnam · On-site</p>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">Education</h2>
                        <div className="flex flex-col">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Academy of Cryptography
                                Techniques</p>
                            <p className="text-gray-600 dark:text-gray-400">Information Technology: Embedded and Mobile
                                Development</p>
                        </div>
                    </section>

                    {/* Certifications */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b dark:border-gray-700 pb-2">Licenses
                            &
                            Certifications</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {certifications.map((cert) => (
                                <div key={cert.badgeId} className="flex flex-col items-center gap-2">
                                    <div
                                        data-iframe-width="150"
                                        data-iframe-height="270"
                                        data-share-badge-id={cert.badgeId}
                                        data-share-badge-host="https://www.credly.com"
                                    />
                                    <p className="text-xs text-center text-gray-600 dark:text-gray-400">{cert.title}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Honors & Awards */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">Honors
                            & Awards</h2>
                        <div className="flex items-start gap-4">
                            <div className="text-2xl shrink-0">🏆</div>
                            <div>
                                <div
                                    className="cursor-pointer inline-block"
                                    onMouseEnter={() => setShowAwardImage(true)}
                                    onMouseLeave={() => setShowAwardImage(false)}
                                    onFocus={() => setShowAwardImage(true)}
                                    onBlur={() => setShowAwardImage(false)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label="VMO C11 Shining Star Award"
                                >
                                    <p className="font-semibold text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                        VMO C11 Shining Star Award
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">January 2023</p>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            {/* Fullsize Centered Image Preview on Hover */}
            {showAwardImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs pointer-events-none transition-opacity duration-200 animate-in fade-in"
                    aria-hidden="true"
                >
                    <div className="relative max-w-lg max-h-[85vh] bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col items-center">
                        <Image
                            src="/vmo-c11-shining-star.jpeg"
                            alt="VMO C11 Shining Star Award"
                            width={768}
                            height={1024}
                            className="max-h-[75vh] w-auto h-auto object-contain rounded-xl"
                            priority
                        />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 text-center">
                            VMO C11 Shining Star Award · January 2023
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
