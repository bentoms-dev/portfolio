import React from 'react';
import Tile from './Tile';
import { Music2, Play, AudioWaveform } from 'lucide-react';
import Link from 'next/link';

export default function MusicTile() {
    return (
        <Tile colSpan={1} rowSpan={1} delay={0.2} className="bg-slate-900 group/music">
             <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                         <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                             <Music2 size={20} />
                         </div>
                         <h3 className="text-xl font-bold text-slate-200">Music</h3>
                    </div>
                    <span className="text-xs font-mono text-purple-400 opacity-0 group-hover/music:opacity-100 transition-opacity">
                        LIVE_FEED
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors cursor-pointer group/track">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white">
                                    <Play size={12} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-200">SOLACE</p>
                                    <p className="text-xs text-slate-500">2025 • Post-Hardcore</p>
                                </div>
                            </div>
                            <AudioWaveform size={16} className="text-purple-400 opacity-50" />
                        </div>
                    </div>

                    <Link
                        href="https://linktr.ee/galleonofficial"
                        target="_blank"
                        className="block w-full py-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg"
                    >
                        Stream All
                    </Link>
                </div>
            </div>
        </Tile>
    );
}
