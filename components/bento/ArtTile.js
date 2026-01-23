import React from 'react';
import Tile from './Tile';
import { Palette, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import meCreative from '../../public/skull.png';
import Link from 'next/link';

export default function ArtTile() {
    return (
        <Tile colSpan={1} rowSpan={2} delay={0.3} className="relative p-0 !overflow-hidden group/art">
             <Image
                src={meCreative}
                alt="Creative Art"
                fill
                className="object-cover transition-transform duration-700 group-hover/art:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 flex flex-col justify-end">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400 backdrop-blur-md">
                        <Palette size={20} />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Visual Art</h3>
                <p className="text-sm text-slate-300 mb-4 line-clamp-2">Exploring the intersection of digital and analog mediums.</p>

                <Link
                    href="https://instagram.com/galleon_art"
                    target="_blank"
                    className="flex items-center gap-2 text-xs font-bold text-white bg-white/20 backdrop-blur-md p-3 rounded-lg hover:bg-white/30 transition-colors w-fit"
                >
                    View Gallery <ExternalLink size={14} />
                </Link>
            </div>
        </Tile>
    );
}
