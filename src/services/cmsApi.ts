"use client";
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface MediaFormat {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: string | null;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
}

export interface Media {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
        large?: MediaFormat;
        small?: MediaFormat;
        medium?: MediaFormat;
        thumbnail?: MediaFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: unknown;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface Article {
    id: number;
    documentId: string;
    title: string;
    description: string;
    tags: string[];
    publishedAt: string;
    cover?: Media;
    mediaAssets?: Media[];
    MDContent?: string;
}

export interface ArticleListResponse {
    data: Article[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface ArticleListQueries {
    page?: number;
    pageSize?: number;
}

const defaultListQueries: ArticleListQueries = {
    page: 1,
    pageSize: 25
}


// This hook is for client-side data fetching with SWR
export function useArticles(queryOptions: Partial<ArticleListQueries> = {}) {
    const queries = {...defaultListQueries, ...queryOptions};

    // Build query string with Strapi format
    const params = new URLSearchParams();
    params.append('fields[0]', 'id');
    params.append('fields[1]', 'documentId');
    params.append('fields[2]', 'title');
    params.append('fields[3]', 'description');
    params.append('fields[4]', 'tags');
    params.append('fields[5]', 'publishedAt');
    params.append('populate[0] ', 'cover');

    if (queries.page) {
        params.append('pagination[page]', queries.page.toString());
    }
    if (queries.pageSize) {
        params.append('pagination[pageSize]', queries.pageSize.toString());
    }

    const {data, error, isLoading} = useSWR<ArticleListResponse>(
        `${process.env.NEXT_PUBLIC_CMS_API_HOST}/api/articles?${params.toString()}`,
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );

    return {
        articles: data?.data || [],
        meta: data?.meta,
        isLoading,
        isError: error
    };
}

export interface ArticleDetailResponse {
    data: Article;
    meta: Record<string, unknown>;
}

export async function getArticleById(documentId: string): Promise<Article> {
    const params = new URLSearchParams();
    params.append('populate[0]', 'cover');
    params.append('populate[1]', 'mediaAssets');

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_API_HOST}/api/articles/${documentId}?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch article');
    }

    const result: ArticleDetailResponse = await response.json();
    return result.data;
}