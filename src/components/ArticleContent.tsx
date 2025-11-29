import React, {useEffect, useState} from 'react';
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";
import MDEditor from '@uiw/react-md-editor';
import {CustomNavbar} from "@/components/CustomNavbar";
import {Article} from "@/services/cmsApi";
import {formatDate, slugify} from "@/utils";
import Image from "next/image";
import {TableOfContents, TOCEntry} from "@/components/TableOfContents";
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import {visit} from 'unist-util-visit';
import rehypeSlug from 'rehype-slug';

const extractHeadings = () => (tree: any, file: any) => {
    const toc: TOCEntry[] = [];
    visit(tree, 'heading', (node: any) => {
        const text = node.children.map((child: any) => child.value).join('');
        if (text) {
            toc.push({
                text,
                level: node.depth,
                id: slugify(text),
            });
        }
    });
    if (!file.data) {
        file.data = {};
    }
    file.data.toc = toc;
};


export const ArticleContent = ({article}: { article: Article }) => {
    const [markdownContent, setMarkdownContent] = useState("");
    const [toc, setToc] = useState<TOCEntry[]>([]);
    const AUTHOR_NAME = 'Polodev';

    useEffect(() => {
        if (article.MDContent) {
            setMarkdownContent(article.MDContent);

            const processor = unified()
                .use(remarkParse)
                .use(remarkGfm)
                .use(extractHeadings)
                .use(remarkRehype)
                .use(rehypeStringify);

            const file = processor.processSync(article.MDContent);
            setToc(file.data.toc as TOCEntry[]);
        }
    }, [article.MDContent]);

    return (
        <div className="max-w-3xl mx-auto">
            <CustomNavbar/>
            <main className="container mx-auto px-2 py-8 pt-28">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{article.title}</h1>
                <div className="flex items-center mb-8 text-gray-500">
                    <Image width={40}
                           height={40}
                           className="w-12 h-12 rounded-full mr-4"
                           src="https://d3iy3ktsgwux5n.cloudfront.net/production/small_polodev_logo_1257b80627.jpg"
                           alt={AUTHOR_NAME}/>
                    <div>
                        <p className="font-semibold text-gray-800">{AUTHOR_NAME}</p>
                        <p>{formatDate(article.publishedAt)}</p>
                    </div>
                </div>

                <TableOfContents toc={toc}/>

                <article>
                    <MDEditor.Markdown source={markdownContent}
                                       style={{whiteSpace: 'pre-wrap'}}
                                       wrapperElement={{"data-color-mode": "light"}}
                                       rehypePlugins={[rehypeRaw, rehypeSlug]}
                                       remarkPlugins={[remarkGfm]}
                    />
                </article>
            </main>

        </div>
    );
};
