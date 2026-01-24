import React from 'react';
import Tile from './Tile';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail } from 'lucide-react';

export default function ProfileTile() {
    return (
        <Tile colSpan={2} rowSpan={2} className="relative p-0 !overflow-hidden flex flex-col justify-end group/profile">
             <Image
                src="/me.png"
                alt="Ben Toms"
                fill
                priority
                className="object-cover object-top opacity-60 group-hover/profile:opacity-80 transition-opacity duration-700 grayscale hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 p-8">
                <div className="mb-4">
                     <h1 className="text-5xl lg:text-7xl font-bold text-white mb-2 tracking-tight">
                        BEN TOMS
                    </h1>
                    <div className="text-xl lg:text-2xl font-light text-slate-300 flex flex-wrap gap-3">
                        <span className="text-white">Developer.</span>
                        <span className="text-purple-400">Musician.</span>
                        <span className="text-pink-400">Creative.</span>
                    </div>
                </div>

                <p className="text-lg text-slate-400 max-w-xl mb-6 leading-relaxed">
                    Technical Lead & Solution Architect. Designing systems, steering projects, and mentoring brilliant teams to deliver work we can be proud of.
                </p>

                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-md">
                        <MapPin size={14} /> Alicante, Spain
                    </div>
                     <Link href="/bio" className="flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer ring-1 ring-white/20 hover:ring-white/50">
                        Read My Story
                    </Link>
                </div>
            </div>
        </Tile>
    );
}
