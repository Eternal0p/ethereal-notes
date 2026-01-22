'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import { useEffect } from 'react';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import type { SuggestionOptions } from '@tiptap/suggestion';
import { WikiLinkSuggestion, type WikiLinkSuggestionRef } from './wiki-link-suggestion';
import type { Note } from '@/lib/types';

type RichTextEditorProps = {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    notes?: Note[]; // All notes for wiki-link suggestions
    onWikiLinkClick?: (noteId: string) => void;
};

export default function RichTextEditor({
    content,
    onChange,
    placeholder,
    className,
    notes = [],
    onWikiLinkClick
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Mention.configure({
                HTMLAttributes: {
                    class: 'wiki-link text-primary font-medium cursor-pointer hover:underline',
                },
                suggestion: {
                    char: '[[',
                    allowSpaces: true,
                    items: ({ query }: { query: string }) => {
                        return notes
                            .filter(note =>
                                note.title.toLowerCase().includes(query.toLowerCase())
                            )
                            .slice(0, 10);
                    },
                    render: () => {
                        let component: ReactRenderer<WikiLinkSuggestionRef>;
                        let popup: any;

                        return {
                            onStart: (props: any) => {
                                component = new ReactRenderer(WikiLinkSuggestion, {
                                    props,
                                    editor: props.editor,
                                });

                                if (!props.clientRect) {
                                    return;
                                }

                                popup = tippy('body', {
                                    getReferenceClientRect: props.clientRect,
                                    appendTo: () => document.body,
                                    content: component.element,
                                    showOnCreate: true,
                                    interactive: true,
                                    trigger: 'manual',
                                    placement: 'bottom-start',
                                });
                            },

                            onUpdate(props: any) {
                                component.updateProps(props);

                                if (!props.clientRect) {
                                    return;
                                }

                                popup[0].setProps({
                                    getReferenceClientRect: props.clientRect,
                                });
                            },

                            onKeyDown(props: any) {
                                if (props.event.key === 'Escape') {
                                    popup[0].hide();
                                    return true;
                                }

                                return component.ref?.onKeyDown(props.event) || false;
                            },

                            onExit() {
                                popup[0].destroy();
                                component.destroy();
                            },
                        };
                    },
                } as Partial<SuggestionOptions>,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
            },
            handleClickOn: (view, pos, node, nodePos, event) => {
                if (node.type.name === 'mention' && onWikiLinkClick) {
                    const attrs = node.attrs as { id?: string };
                    if (attrs.id) {
                        onWikiLinkClick(attrs.id);
                        event.preventDefault();
                        return true;
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Update editor content when prop changes (for editing existing notes)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={className}>
            <EditorContent
                editor={editor}
                placeholder={placeholder}
                className="text-zinc-300 leading-relaxed"
            />
        </div>
    );
}
