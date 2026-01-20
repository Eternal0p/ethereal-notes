'use client';

import { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TagInputProps = {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
};

export default function TagInput({
    tags,
    onChange,
    placeholder = "Add tags...",
    maxTags = 10
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            // Remove last tag on backspace if input is empty
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const trimmedValue = inputValue.trim().toLowerCase();

        // Validation
        if (!trimmedValue) return;
        if (trimmedValue.length > 20) {
            // Tag too long
            return;
        }
        if (tags.includes(trimmedValue)) {
            // Tag already exists
            setInputValue('');
            return;
        }
        if (tags.length >= maxTags) {
            // Max tags reached
            return;
        }

        onChange([...tags, trimmedValue]);
        setInputValue('');
    };

    const removeTag = (index: number) => {
        onChange(tags.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[32px]">
                <AnimatePresence mode="popLayout">
                    {tags.map((tag, index) => (
                        <motion.div
                            key={tag}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                            <Badge
                                variant="secondary"
                                className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 pl-2 pr-1 py-1 text-xs"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    className="ml-1 hover:bg-indigo-500/30 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
                placeholder={tags.length >= maxTags ? `Max ${maxTags} tags` : placeholder}
                disabled={tags.length >= maxTags}
                className="border-white/10 bg-white/5"
                maxLength={20}
            />
            {tags.length > 0 && (
                <p className="text-xs text-zinc-500">
                    {tags.length}/{maxTags} tags • Press Enter to add • Backspace to remove
                </p>
            )}
        </div>
    );
}
