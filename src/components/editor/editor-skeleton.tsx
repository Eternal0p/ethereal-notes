'use client';

export default function EditorSkeleton() {
    return (
        <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden
                    bg-gradient-to-br from-zinc-900/40 to-zinc-950/20 
                    backdrop-blur-xl border border-white/5 p-6 space-y-4
                    animate-pulse">
            {/* Toolbar skeleton */}
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="w-8 h-8 bg-white/5 rounded-lg"
                    />
                ))}
            </div>

            {/* Content skeleton */}
            <div className="space-y-3">
                {/* Title line */}
                <div className="h-8 bg-white/10 rounded-lg w-2/3" />

                {/* Paragraph lines */}
                <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-11/12" />
                    <div className="h-4 bg-white/5 rounded w-10/12" />
                </div>

                {/* Another paragraph */}
                <div className="space-y-2 pt-4">
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-9/12" />
                </div>
            </div>

            {/* Loading indicator */}
            <div className="flex items-center justify-center pt-8">
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}
