import { ReactRenderer } from '@tiptap/react';
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { Note } from '@/lib/types';

export type MentionSuggestion = {
    id: string;
    title: string;
    updatedAt?: string;
};

type MentionListProps = SuggestionProps<MentionSuggestion>;

export type MentionListHandle = {
    onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

const MentionList = forwardRef<MentionListHandle, MentionListProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        if (index >= props.items.length) return;
        const item = props.items[index];
        if (item) {
            props.command(item);
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    if (props.items.length === 0) {
        return (
            <div className="glassmorphic-dropdown min-w-[280px] p-2">
                <div className="px-3 py-2 text-sm text-zinc-500">No notes found</div>
            </div>
        );
    }

    return (
        <div className="glassmorphic-dropdown min-w-[280px] p-2 max-h-[300px] overflow-y-auto">
            {props.items.map((item, index) => (
                <button
                    key={item.id}
                    onClick={() => selectItem(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${index === selectedIndex
                            ? 'bg-primary/20 text-primary'
                            : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <div className="font-medium truncate">{item.title}</div>
                    {item.updatedAt && (
                        <div className="text-xs text-zinc-500 mt-0.5">{item.updatedAt}</div>
                    )}
                </button>
            ))}
        </div>
    );
});

MentionList.displayName = 'MentionList';

export default MentionList;

// Helper function to render the suggestion dropdown
export function renderMentionSuggestion() {
    let component: ReactRenderer<MentionListHandle, MentionListProps> | null = null;
    let popup: any = null;

    return {
        onStart: (props: SuggestionProps<MentionSuggestion>) => {
            component = new ReactRenderer(MentionList, {
                props,
                editor: props.editor,
            });

            if (!props.clientRect) return;

            // Create popup element
            popup = document.createElement('div');
            popup.style.position = 'absolute';
            popup.style.zIndex = '9999';
            document.body.appendChild(popup);
            popup.appendChild(component.element);

            // Position the popup
            const rect = props.clientRect();
            if (rect) {
                popup.style.top = `${rect.bottom + window.scrollY}px`;
                popup.style.left = `${rect.left + window.scrollX}px`;
            }
        },

        onUpdate(props: SuggestionProps<MentionSuggestion>) {
            component?.updateProps(props);

            if (!props.clientRect) return;

            const rect = props.clientRect();
            if (rect && popup) {
                popup.style.top = `${rect.bottom + window.scrollY}px`;
                popup.style.left = `${rect.left + window.scrollX}px`;
            }
        },

        onKeyDown(props: SuggestionKeyDownProps) {
            if (props.event.key === 'Escape') {
                popup?.remove();
                component?.destroy();
                return true;
            }

            return component?.ref?.onKeyDown(props) ?? false;
        },

        onExit() {
            popup?.remove();
            component?.destroy();
        },
    };
}
