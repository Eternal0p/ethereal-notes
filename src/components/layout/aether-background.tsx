'use client';

export default function AetherBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Deep radial gradient base */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#18181b_0%,#09090b_100%)]"></div>

            {/* Drifting Shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-float mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[100px] animate-float-delayed mix-blend-screen"></div>
            <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-blue-900/10 blur-[80px] animate-float mix-blend-overlay"></div>

            {/* Geometric accents (CSS Shapes) */}
            <div className="absolute top-[15%] right-[15%] w-32 h-32 border border-white/5 rounded-full blur-[1px] opacity-20 animate-float"></div>
            <div className="absolute bottom-[20%] left-[10%] w-48 h-48 border border-white/5 rotate-45 opacity-10 animate-float-delayed"></div>
        </div>
    );
}
