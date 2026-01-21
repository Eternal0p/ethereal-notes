'use client';

import { Editor } from '@tiptap/react';
import { Bold, Italic, Link as LinkIcon, Code, Underline } from 'lucide-react';
import { useCallback, useState } from 'react';

type EditorToolbarProps = {
    editor: Editor | null;
};

export default function EditorToolbar({ editor }: EditorToolbarProps) {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    const setLink = useCallback(() => {
        if (!editor) return;

        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
        setShowLinkInput(false);
        setLinkUrl('');
    }, [editor, linkUrl]);

    const toggleLink = () => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        if (previousUrl) {
            editor.chain().focus().unsetLink().run();
        } else {
            setShowLinkInput(true);
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 p-2 glass-panel rounded-xl border border-white/10">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${editor.isActive('bold')
                        ? 'bg-white/20 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${editor.isActive('italic')
                        ? 'bg-white/20 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${editor.isActive('strike')
                        ? 'bg-white/20 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                title="Underline"
            >
                <Underline className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-white/10"></div>

            <button
                onClick={toggleLink}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${editor.isActive('link')
                        ? 'bg-white/20 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                title="Link"
            >
                <LinkIcon className="w-4 h-4" />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${editor.isActive('code')
                        ? 'bg-white/20 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                title="Code"
            >
                <Code className="w-4 h-4" />
            </button>

            {showLinkInput && (
                <div className="flex items-center gap-2 ml-2">
                    <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setLink();
                            } else if (e.key === 'Escape') {
                                setShowLinkInput(false);
                                setLinkUrl('');
                            }
                        }}
                        placeholder="Enter URL..."
                        className="px-2 py-1 text-xs bg-zinc-800 border border-white/10 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-primary/50"
                        autoFocus
                    />
                    <button
                        onClick={setLink}
                        className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary/80 transition-colors"
                    >
                        Add
                    </button>
                </div>
            )}
        </div>
    );
}
