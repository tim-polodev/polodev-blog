import React from 'react';
import {Article} from "@/services/cmsApi";
import Link from "next/link";
import {formatDate} from "@/utils";

export const ArticleCard = ({article}: { article: Article }) => {
    const coverImage = article.cover?.formats?.medium?.url
        || article.cover?.url
        || 'https://placehold.co/600x400/ccc/ffffff?text=No+Image';

    return (
        <Link href={`/articles/${article.documentId}`} passHref>
            <div
                className="bg-white rounded-xl shadow-md overflow-hidden
                    hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="h-50 w-full object-cover" src={coverImage} onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400/ccc/ffffff?text=Image+Error';
                }} alt={article.cover?.alternativeText || `Image for ${article.title}`}/>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 h-15 overflow-hidden text-ellipsis">
                        {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 h-15 overflow-hidden text-ellipsis">
                        {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {article.tags?.slice(0, 3).map((tag, index) => (
                                <span key={index}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm">{formatDate(article.publishedAt)}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};