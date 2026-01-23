import React from "react";
import Image from 'next/image'
import Link from 'next/link'
import meCreative from '.././public/ben-toms-creative.jpg'

export default function Creative() {
    // Placeholder for art gallery
    const artPieces = [
        { id: 1, title: "Abstract 1", color: "bg-orange-300" },
        { id: 2, title: "Portrait 2", color: "bg-teal-300" },
        { id: 3, title: "Landscape 3", color: "bg-indigo-300" },
        { id: 4, title: "Digital 4", color: "bg-pink-300" },
    ];

    return (
        <div className='grid grid-cols-1 section__creative mb-10 lg:mb-28'>
             <div className='grid grid-cols-1 lg:grid-cols-2 mb-10'>
                 <div className="lg:pr-10">
                    <h2 className='text__pull-up text-5xl mb-4'>CREATIVE</h2>
                    <p className='lg:w-5/6 mb-6'>
                        <span className="text__callout">VISUAL EXPRESSION.</span> Programming is creative, but sometimes I need to step away from the screen. I draw, paint, and create digital art.
                    </p>
                    <p className='lg:ml-auto lg:w-5/6 mb-6'>
                         Check out my art on Instagram <Link
                        className="underline decoration-2 hover:text-purple-500"
                        passHref
                        target="_blank"
                        href='https://instagram.com/galleon_art'>
                            @galleon_art
                        </Link>.
                    </p>
                </div>
                 <div className="flex items-center">
                    {/* Featured image could go here or removed if gallery is enough */}
                     <Image
                        priority={true}
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
                        src={meCreative} alt="A picture of Ben Toms"/>
                 </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {artPieces.map((art) => (
                    <div key={art.id} className={`aspect-[3/4] ${art.color} w-full flex items-center justify-center relative group overflow-hidden`}>
                         <span className="text-white font-bold opacity-50 text-2xl group-hover:scale-110 transition-transform">{art.title}</span>
                         <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
