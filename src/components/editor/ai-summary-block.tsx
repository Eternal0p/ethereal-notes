'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import { generateSummary, extractKeywords } from '@/lib/nlp-utils';

type AISummaryBlockProps = {
    content: string;
    onClose?: () => void;
};

export default function AISummaryBlock({ content, onClose }: AISummaryBlockProps) {
    const [summary, setSummary] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        // Generate summary and keywords
        const generatedSummary = generateSummary(content);
        const generatedKeywords = extractKeywords(content);

        setSummary(generatedSummary);
        setKeywords(generatedKeywords);

        // Typewriter effect
        let index = 0;
        const interval = setInterval(() => {
            if (index < generatedSummary.length) {
                setDisplayedText(generatedSummary.substring(0, index + 1));
                index++;
            } else {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, 20); // 20ms per character for smooth typing

        return () => clearInterval(interval);
    }, [content]);

    return (
        <div className="relative glass-card p-5 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-primary">AI Summary</h3>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-zinc-400 hover:text-white" />
                    </button>
                )}
            </div>

            {/* Summary text with typewriter effect */}
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">
                {displayedText}
                {isTyping && (
                    <span className="inline-block w-0.5 h-4 bg-primary ml-1 animate-pulse" />
                )}
            </p>

            {/* Keywords */}
            {keywords.length > 0 && !isTyping && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                    <span className="text-xs text-zinc-500 mr-1">Keywords:</span>
                    {keywords.slice(0, 8).map((keyword, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium 
                         rounded-md border border-primary/20"
                        >
                            {keyword}
                        </span>
                    ))}
                    {keywords.length > 8 && (
                        <span className="text-xs text-zinc-500">+{keywords.length - 8} more</span>
                    )}
                </div>
            )}

            {/* Loading indicator */}
            {isTyping && (
                <div className="absolute bottom-3 right-3">
                    <Loader2 className="w-3 h-3 text-primary/40 animate-spin" />
                </div>
            )}
        </div>
    );
}
