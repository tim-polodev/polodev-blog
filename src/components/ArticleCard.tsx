import React from 'react';
import {Article} from "@/services/cmsApi";
import Link from "next/link";
import {formatDate} from "@/utils";

export const ArticleCard = ({article}: { article: Article }) => {
    const coverImage = article.cover?.formats?.medium?.url
        || article.cover?.url
        || 'https://placehold.co/600x400/ccc/ffffff?text=No+Image';

    return (
        <Link href={`/articles/${article.documentId}`} passHref className="flex">
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden
                    hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer
                    flex flex-col w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="h-[12.5rem] w-full object-cover flex-shrink-0" src={coverImage} onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400/ccc/ffffff?text=Image+Error';
                }} alt={article.cover?.alternativeText || `Image for ${article.title}`}/>
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 h-[3.75rem] overflow-hidden text-ellipsis line-clamp-2">
                        {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-[3.75rem] overflow-hidden text-ellipsis line-clamp-3">
                        {article.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-wrap gap-2">
                            {article.tags?.slice(0, 3).map((tag, index) => (
                                <span key={index}
                                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm flex-shrink-0">{formatDate(article.publishedAt)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};