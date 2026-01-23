import React from 'react';
import Tile from './Tile';

export default function StatsTile() {
    return (
        <Tile colSpan={1} rowSpan={1} delay={0.1} className="bg-slate-900 flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4 h-full">
                <div className="flex flex-col justify-center items-center text-center p-2 bg-white/5 rounded-xl">
                    <span className="text-4xl font-bold text-white mb-1">15+</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Years Exp.</span>
                </div>
                 <div className="flex flex-col justify-center items-center text-center p-2 bg-white/5 rounded-xl">
                    <span className="text-4xl font-bold text-blue-400 mb-1">50+</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Projects</span>
                </div>
                 <div className="flex flex-col justify-center items-center text-center p-2 bg-white/5 rounded-xl">
                    <span className="text-4xl font-bold text-purple-400 mb-1">6</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Teams Led</span>
                </div>
                 <div className="flex flex-col justify-center items-center text-center p-2 bg-white/5 rounded-xl">
                    <span className="text-4xl font-bold text-pink-400 mb-1">1M+</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Users Reached</span>
                </div>
            </div>
        </Tile>
    );
}
