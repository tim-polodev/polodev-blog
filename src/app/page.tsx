"use client";
import {CustomNavbar} from "@/components/CustomNavbar";
import {ArticleList} from "@/components/ArticleList";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <CustomNavbar/>
            <main className="container mx-auto px-2 py-8 pt-28">
                <div className="max-w-8xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4 text-center dark:text-white">Welcome to Polodev!</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12">
                        This is my personal blog where I share my ideas, projects, and experiences in software
                        development.
                    </p>
                    <ArticleList/>
                </div>
            </main>
        </div>
    );
}
