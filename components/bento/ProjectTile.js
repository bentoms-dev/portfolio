import React from 'react';
import Tile from './Tile';
import { Package, ArrowUpRight, Download } from 'lucide-react';
import Link from 'next/link';

export default function ProjectTile({
    title,
    description,
    type = "NPM Package",
    downloads,
    link,
    color = "bg-blue-500",
    delay = 0
}) {
    return (
        <Tile colSpan={1} rowSpan={1} delay={delay} className="bg-slate-900 group/project cursor-pointer hover:bg-slate-800 transition-colors">
            <Link href={link} target="_blank" className="flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div className={`p-2 ${color}/20 rounded-lg text-${color.replace('bg-', '')} mb-4`}>
                        <Package size={20} className={`text-${color.replace('bg-', '')}`} />
                    </div>
                    <ArrowUpRight size={20} className="text-slate-500 group-hover/project:text-white transition-colors" />
                </div>

                <div>
                    <h3 className="text-xl font-bold text-slate-200 group-hover/project:text-white transition-colors mb-1">{title}</h3>
                    <p className="text-xs text-slate-400 mb-3">{type}</p>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4">{description}</p>

                    {downloads && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                            <Download size={12} />
                            <span>{downloads} downloads</span>
                        </div>
                    )}
                </div>
            </Link>
        </Tile>
    );
}
