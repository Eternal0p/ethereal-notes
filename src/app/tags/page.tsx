'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Hash, Palette, Edit2, Trash2 } from 'lucide-react';
import { useTagsStore } from '@/store/tags';

export default function TagsPage() {
    const router = useRouter();
    const { tags, loadTags, isLoading } = useTagsStore();

    useEffect(() => {
        loadTags();
    }, [loadTags]);

    const tagArray = Array.from(tags.values()).sort((a, b) => b.count - a.count);

    return (
        <div className="min-h-screen bg-background-dark p-6">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <button
                    onClick={() => router.push('/')}
                    className="text-zinc-400 hover:text-white mb-4 transition-colors"
                >
                    ← Back to Dashboard
                </button>
                <div className="flex items-center gap-3">
                    <Hash className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Tag Dashboard</h1>
                        <p className="text-zinc-400 text-sm">Manage and organize your tags</p>
                    </div>
                </div>
            </div>

            {/* Tags Grid */}
            <div className="max-w-6xl mx-auto">
                {isLoading ? (
                    <div className="text-center py-12 text-zinc-500">
                        Loading tags...
                    </div>
                ) : tagArray.length === 0 ? (
                    <div className="text-center py-12">
                        <Hash className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500">No tags yet. Start adding tags to your notes!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {tagArray.map(tag => (
                            <TagCard key={tag.name} tag={tag} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Tag Card Component
function TagCard({ tag }: { tag: { name: string; count: number; color?: string } }) {
    const router = useRouter();
    const { updateTagColor, deleteTag } = useTagsStore();

    // Calculate size based on usage count (for visual weight)
    const getSizeClass = () => {
        if (tag.count > 10) return 'text-lg scale-110';
        if (tag.count > 5) return 'text-base scale-105';
        return 'text-sm';
    };

    const handleColorChange = async (color: string) => {
        await updateTagColor(tag.name, color);
    };

    const handleDelete = async () => {
        if (confirm(`Delete tag "${tag.name}"? This won't delete notes, just the tag.`)) {
            await deleteTag(tag.name);
        }
    };

    return (
        <div
            className={`glass-card p-5 rounded-xl group hover:scale-105 transition-all ${getSizeClass()}`}
            style={{
                borderColor: tag.color ? `${tag.color}40` : undefined,
            }}
        >
            {/* Tag name and count */}
            <div
                className="flex items-center gap-2 mb-3 cursor-pointer"
                onClick={() => router.push(`/search?tag=${encodeURIComponent(tag.name)}`)}
            >
                <Hash
                    className="w-5 h-5"
                    style={{ color: tag.color || '#6262f3' }}
                />
                <div className="flex-1">
                    <h3
                        className="font-medium truncate"
                        style={{ color: tag.color || '#fff' }}
                    >
                        {tag.name}
                    </h3>
                    <p className="text-xs text-zinc-500">{tag.count} notes</p>
                </div>
            </div>

            {/* Color picker and actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                    {['#6262f3', '#ec4899', '#22c55e', '#f97316', '#06b6d4'].map(color => (
                        <button
                            key={color}
                            onClick={() => handleColorChange(color)}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${tag.color === color ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            style={{ backgroundColor: color }}
                            title="Change color"
                        />
                    ))}
                </div>
                <button
                    onClick={handleDelete}
                    className="ml-auto p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete tag"
                >
                    <Trash2 className="w-4 h-4 text-red-400" />
                </button>
            </div>
        </div>
    );
}
