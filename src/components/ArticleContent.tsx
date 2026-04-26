import React, {useEffect, useState} from 'react';
import remarkGfm from 'remark-gfm';
import rehypeRaw from "rehype-raw";
import rehypePrism from 'rehype-prism-plus';
import ReactMarkdown, {Components, ExtraProps} from 'react-markdown';
import {CustomNavbar} from "@/components/CustomNavbar";
import {Article} from "@/services/cmsApi";
import {formatDate, slugify} from "@/utils";
import Image from "next/image";
import {TableOfContents, TOCEntry} from "@/components/TableOfContents";
import {unified, Plugin} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import {visit} from 'unist-util-visit';
import rehypeSlug from 'rehype-slug';
import {Root, Heading} from 'mdast';
import {VFile} from 'vfile';
import {toString} from 'mdast-util-to-string';

const extractHeadings: Plugin<[], Root> = () => (tree: Root, file: VFile) => {
    const toc: TOCEntry[] = [];
    visit(tree, 'heading', (node: Heading) => {
        const text = toString(node);
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

const CodeBlock = ({children, className, ...props}: React.HTMLAttributes<HTMLElement> & ExtraProps) => {
    const [copied, setCopied] = useState(false);

    const getCodeText = (nodes: React.ReactNode): string => {
        if (typeof nodes === 'string') return nodes;
        if (Array.isArray(nodes)) return nodes.map(getCodeText).join('');
        if (React.isValidElement(nodes)) {
            // @ts-expect-error - children might not be in props
            return getCodeText(nodes.props.children);
        }
        return '';
    };

    const code = getCodeText(children).replace(/\n$/, '');
    const match = /language-(\w+)/.exec(className || '');

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    if (!match) {
        return (
            <code className={className} {...props}>
                {children}
            </code>
        );
    }

    return (
        <div
            className="relative group my-4 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-500/30 rounded-lg overflow-hidden bg-[#2d2d2d]"
            onClick={handleCopy}
            title="Click to copy"
        >
            <div
                className={`absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div
                    className="bg-white text-black px-4 py-2 rounded-full font-bold shadow-lg transform transition-transform duration-300 scale-100 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                         strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Copied!
                </div>
            </div>
            <div className="overflow-x-auto">
                <code
                    className={`${className} block p-4 transition-colors duration-200 group-hover:bg-gray-800/90 !bg-transparent`}
                    style={{whiteSpace: 'pre'}}
                    {...props}>
                    {children}
                </code>
            </div>
        </div>
    );
};

const PreBlock = ({children, ...props}: React.HTMLAttributes<HTMLPreElement> & ExtraProps) => {
    return (
        <pre className="p-0 !bg-transparent !m-0" {...props}>
            {children}
        </pre>
    );
};

const components: Components = {
    code: CodeBlock,
    pre: PreBlock,
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
                           src={"/polodev-logo.jpg"}
                           alt={AUTHOR_NAME}/>
                    <div>
                        <p className="font-semibold text-gray-800">{AUTHOR_NAME}</p>
                        <p>{formatDate(article.publishedAt)}</p>
                    </div>
                </div>

                <TableOfContents toc={toc}/>

                <article className="prose prose-lg max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSlug, [rehypePrism, {ignoreMissing: true}]]}
                        components={components}
                    >
                        {markdownContent}
                    </ReactMarkdown>
                </article>
            </main>

        </div>
    );
};
