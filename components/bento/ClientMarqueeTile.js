import React from 'react';
import Tile from './Tile';

const clients = [
    "Samsung", "Dr. Martens", "Spotify", "Missoma", "Tesco", "Cafédirect", "ExxonMobil", "Hitachi"
];

export default function ClientMarqueeTile() {
    return (
        <Tile colSpan={4} rowSpan={1} className="bg-slate-900 !p-0 flex items-center overflow-hidden h-24">
            <div className="relative w-full flex items-center">
                 <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10" />
                 <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10" />

                <div className="flex animate-marquee whitespace-nowrap">
                    {[...clients, ...clients, ...clients].map((client, i) => (
                        <div key={i} className="mx-8 text-2xl font-bold text-slate-500 hover:text-white transition-colors cursor-default">
                            {client}
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
            `}</style>
        </Tile>
    );
}
