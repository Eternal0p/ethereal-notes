'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useRouter } from 'next/navigation';

// Custom React component for wiki-link pills
function WikiLinkComponent({ node }: { node: any }) {
    const router = useRouter();
    const { id, label } = node.attrs;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (id) {
            router.push(`/?note=${id}`);
        }
    };

    return (
        <NodeViewWrapper as="span" className="wiki-link-wrapper inline">
            <span
                onClick={handleClick}
                className="inline-flex items-center px-2 py-0.5 rounded-md cursor-pointer
                   bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 
                   hover:text-indigo-300 transition-all text-sm font-medium
                   border border-indigo-500/20"
                contentEditable={false}
            >
                [[{label}]]
            </span>
        </NodeViewWrapper>
    );
}

// TipTap extension for wiki-links
export const WikiLink = Node.create({
    name: 'wikiLink',

    group: 'inline',

    inline: true,

    selectable: false,

    atom: true,

    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: element => element.getAttribute('data-id'),
                renderHTML: attributes => {
                    if (!attributes.id) {
                        return {};
                    }
                    return {
                        'data-id': attributes.id,
                    };
                },
            },
            label: {
                default: null,
                parseHTML: element => element.getAttribute('data-label'),
                renderHTML: attributes => {
                    if (!attributes.label) {
                        return {};
                    }
                    return {
                        'data-label': attributes.label,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="wiki-link"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'span',
            mergeAttributes(HTMLAttributes, { 'data-type': 'wiki-link' }),
            `[[${HTMLAttributes['data-label'] || ''}]]`,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(WikiLinkComponent);
    },
});
