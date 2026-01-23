import React from "react";
import Image from 'next/image'
import Link from 'next/link'

export default function Music() {
    // Placeholder data for albums - to be replaced with real assets
    const albums = [
        { id: 1, title: "Algorithm & Blues", year: "2024", color: "bg-blue-400" },
        { id: 2, title: "Syntax Error", year: "2023", color: "bg-red-400" },
        { id: 3, title: "Lo-Fi Compiler", year: "2022", color: "bg-purple-400" },
        { id: 4, title: "Digital Dreams", year: "2021", color: "bg-green-400" },
        { id: 5, title: "Analog Heart", year: "2020", color: "bg-yellow-400" },
    ];

    return (
        <div className='grid grid-cols-1 mb-10 lg:mb-28'>
            <div className='grid grid-cols-1 lg:grid-cols-2 mb-10'>
                <div className="lg:pr-10">
                    <h2 className='text__pull-up text-5xl mb-4'>MUSICIAN</h2>
                    <p className='mb-6'>
                        <span className="text__callout">SOUNDSCAPES & BEATS.</span> Making music is my escape and my passion. I've released 5 albums over the years, exploring electronic, downtempo, and experimental sounds.
                    </p>
                    <p className="mb-6">
                        Available on all major streaming platforms. <Link
                        className="underline decoration-2 hover:text-blue-500"
                        target="_blank"
                        href="https://linktr.ee/galleonofficial">Listen here</Link>.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {albums.map((album) => (
                    <div key={album.id} className="aspect-square relative group cursor-pointer overflow-hidden">
                        <div className={`w-full h-full ${album.color} flex items-center justify-center text-white font-bold text-xl transition-transform duration-500 group-hover:scale-110`}>
                            {/* Placeholder for Album Art */}
                            <span className="opacity-50">{album.title}</span>
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 font-bold transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                                LISTEN
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
