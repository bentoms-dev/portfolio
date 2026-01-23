import React from 'react';
import Tile from './Tile';
import { Code2, Terminal, Cpu, Globe } from 'lucide-react';

export default function TechStackTile() {
    return (
        <Tile colSpan={1} rowSpan={1} delay={0.1} className="bg-slate-900">
            <div className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <Terminal size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-200">Stack</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-yellow-400" /> JS / TS
                    </div>
                     <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" /> React
                    </div>
                     <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-white" /> Next.js
                    </div>
                     <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-orange-400" /> PostGreSQL
                    </div>
                     <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-green-400" /> Node
                    </div>
                     <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-pink-400" /> WebGL
                    </div>
                </div>
            </div>
        </Tile>
    );
}
