import React from 'react';
import Tile from './Tile';
import { Package, ArrowUpRight, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProjectTile({
    title,
    description,
    type = "NPM Package",
    downloads,
    link,
    color = "bg-blue-500",
    delay = 0,
    colSpan = 1,
    rowSpan = 1,
    image
}) {
    const isExternal = link.startsWith('http');

    const backgroundContent = image ? (
        <>
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover opacity-40 group-hover/project:opacity-50 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </>
    ) : null;

    return (
        <Tile
            colSpan={colSpan}
            rowSpan={rowSpan}
            delay={delay}
            className="bg-slate-900 group/project cursor-pointer hover:bg-slate-800 transition-colors relative overflow-hidden"
            background={backgroundContent}
        >
            <Link href={link} target={isExternal ? "_blank" : "_self"} className="flex flex-col h-full justify-between relative z-10">
                <div className="flex justify-between items-start">
                    <div className={`p-2 ${color}/20 rounded-lg text-${color.replace('bg-', '')} mb-4 backdrop-blur-sm`}>
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
