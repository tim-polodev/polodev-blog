import React from 'react';

export interface TOCEntry {
    text: string;
    level: number;
    id: string;
}

interface TableOfContentsProps {
    toc: TOCEntry[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({toc}) => {
    if (toc.length === 0) {
        return null;
    }

    return (
        <div className="mb-8 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Table of Contents</h2>
            <ul className="space-y-2">
                {toc.map((entry) => (
                    <li key={entry.id} style={{marginLeft: `${Math.min((entry.level - 1) * 1, 3)}rem`}}>
                        <a href={`#${entry.id}`} className="text-blue-600 dark:text-cyan-200 hover:text-blue-800 dark:hover:text-white hover:underline text-sm sm:text-base break-words transition-colors duration-150">
                            {entry.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
