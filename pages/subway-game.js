import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SubwayGame() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-yellow-500/30 selection:text-white">
            <Head>
                <title>Terminal — The Game</title>
                <meta name="description" content="Terminal — a WebGL game." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="max-w-[95%] mx-auto px-4 py-8 h-screen flex flex-col">
                {/* Navigation */}
                <div className="mb-6 flex justify-between items-center">
                     <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Grid
                    </Link>
                    <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">WebGL Experiment</span>
                </div>

                <div className="flex-1 w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-black relative group">
                    <iframe
                        src="/subway-game/index.html"
                        title="Terminal - The Game"
                        className="w-full h-full"
                        style={{ border: 'none' }}
                        allow="fullscreen"
                    />
                </div>

                <div className="mt-6 mb-10 w-1/2 flex text-s flex-col gap-4 text-slate-500 text-left">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                        About the game
                    </h2>
                    <p>
                        Terminal is a narrative-driven 2D platformer set in a deserted London Underground station, where you play as Jack Mallace, a man who wakes up with no memory of how he got there — or why he can&apos;t leave.
                    </p>
                    <p>
                        As Jack explores silent platforms, endless corridors, and empty streets above ground, he begins to uncover fragments of his past and strange signs that the world around him isn&apos;t quite real. Through environmental puzzles and quiet moments of reflection, players piece together Jack&apos;s identity and the truth behind his situation.
                    </p>
                    <p>
                        Blending atmospheric pixel art, minimal dialogue, and emotionally grounded storytelling, Terminal is a slow-burning journey about memory, guilt, and the choice to move forward when the world feels impossible to face.
                    </p>
                </div>

                <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                    <p>
                        Tip: click inside the game to capture keyboard controls.
                    </p>
                     <p>
                        Built with Javascript & custom WebGL engine.
                    </p>
                </div>
            </div>
        </div>
    )
}
