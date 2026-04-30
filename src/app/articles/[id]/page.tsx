"use client";
import {ArticleContent} from "@/components/ArticleContent";
import React, {useEffect, useState} from "react";
import {getArticleById, Article} from "@/services/cmsApi";
import {useParams} from "next/navigation";

type ArticleContentParams = {
    id: string;
};

export default function ArticlePage() {
    const params = useParams<ArticleContentParams>()
    const {id} = params;
    const [article, setArticle] = useState<Article | null>(null);
    // document.documentElement.setAttribute('data-color-mode', 'light')
    useEffect(() => {
        try {
            getArticleById(id).then(articleContent => {
                setArticle(articleContent);
            });
        } catch (error) {
            console.error("Failed to fetch article:", error);
        }

    }, [id]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {article &&
                <ArticleContent article={article}/>
            }
        </div>
    );
}