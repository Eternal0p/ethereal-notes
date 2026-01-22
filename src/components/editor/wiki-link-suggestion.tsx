import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { Note } from '@/lib/types';

export type WikiLinkSuggestionProps = {
    items: Note[];
    command: (item: { id: string; label: string }) => void;
};

export type WikiLinkSuggestionRef = {
    onKeyDown: (event: KeyboardEvent) => boolean;
};

export const WikiLinkSuggestion = forwardRef<WikiLinkSuggestionRef, WikiLinkSuggestionProps>(
    (props, ref) => {
        const [selectedIndex, setSelectedIndex] = useState(0);

        useEffect(() => {
            setSelectedIndex(0);
        }, [props.items]);

        const selectItem = (index: number) => {
            const item = props.items[index];
            if (item) {
                props.command({ id: item.id, label: item.title });
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

        useImperativeHandle(ref, () => ({
            onKeyDown: (event: KeyboardEvent) => {
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
                <div className="glass-panel border border-white/10 rounded-xl p-3 shadow-xl">
                    <div className="text-zinc-500 text-sm">No notes found</div>
                </div>
            );
        }

        return (
            <div className="glass-panel border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-80 overflow-y-auto">
                {props.items.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => selectItem(index)}
                        className={`w-full text-left px-4 py-3 transition-colors border-b border-white/5 last:border-b-0 ${index === selectedIndex
                                ? 'bg-primary/20 text-white'
                                : 'text-zinc-300 hover:bg-white/5'
                            }`}
                    >
                        <div className="font-medium text-sm">{item.title}</div>
                        {item.excerpt && (
                            <div className="text-xs text-zinc-500 mt-1 line-clamp-1">
                                {item.excerpt}
                            </div>
                        )}
                        {item.tags && item.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                                {item.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-700/50 text-zinc-400"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </button>
                ))}
            </div>
        );
    }
);

WikiLinkSuggestion.displayName = 'WikiLinkSuggestion';
