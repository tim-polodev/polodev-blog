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
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
            <ul className="space-y-2">
                {toc.map((entry) => (
                    <li key={entry.id} style={{marginLeft: `${(entry.level - 1) * 1.5}rem`}}>
                        <a href={`#${entry.id}`} className="text-blue-600 hover:underline">
                            {entry.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
