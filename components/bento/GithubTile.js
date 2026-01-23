import React from 'react';
import Tile from './Tile';
import { Github, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GithubTile() {
    return (
        <Tile colSpan={1} rowSpan={1} delay={0.2} className="bg-[#181717] group/github hover:bg-[#202020] transition-colors">
            <Link href="https://github.com/bentoms-dev" target="_blank" className="h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                     <Github size={32} className="text-white" />
                     <div className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-white">
                        @bentoms-dev
                     </div>
                </div>

                <div>
                     <h3 className="text-2xl font-bold text-white mb-2">Open Source</h3>
                     <div className="flex items-center gap-2 text-slate-400 group-hover/github:text-white transition-colors text-sm">
                        Check my contributions <ArrowRight size={16} />
                     </div>
                </div>
            </Link>
        </Tile>
    );
}
