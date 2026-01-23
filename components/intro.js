import React from "react";
import Image from 'next/image'
import me from '.././public/ben-toms-2.jpeg'
import Popup from './popup'

export default function Intro(){

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 col-span-2 min-h-[50vh] items-center'>
        <div className='grid grid-cols-1'>
            <Image
            priority={true}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
            src={me} alt="A picture of Ben Toms"/>
            <span className='italic mt-4'>
                BEN TOMS
            </span>
            <span className="link__highlight">
                <Popup />
            </span>
        </div>
        <div className='grid lg:pr-28 lg:pl-10 lg:col-span-2 content-center'>
            <h1 className='text__pull-up text-6xl mb-6'>DEVELOPER.<br/>CREATIVE.<br/>MUSICIAN.</h1>
            <p className="text-xl mb-4"><span className="text__callout">NOT JUST A CODER.</span> I build digital experiences, create visual art, and compose music. This portfolio is a collection of my work across all these disciplines.</p>
            <p className="text-lg">
                For over 15 years, I've been writing code for global brands like Dr. Martens and Samsung. But my passion doesn't stop at the IDE. I'm a painter, a beat-maker, and a creator at heart.
            </p>
        </div>
    </div>
    )
}
