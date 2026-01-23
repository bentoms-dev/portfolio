import React from "react";
import Image from 'next/image'
import Link from 'next/link'
import meCreative from '.././public/ben-toms-creative.jpg'

export default function Creative() {
    return (
        <div className='grid grid-cols-1 items-center justify-center section__creative mb-10 lg:mb-28'>
            <div className='bg-white lg:w-1/3 p-4 mx-auto lg:text-right text-black'>
                <h2 className='text__pull-up'>CREATIVE</h2>
                <p className='lg:ml-auto lg:w-4/6'>
                    <span className="text__callout text__callout-black">NOT JUST A DEVELOPER.</span> I love to paint, I&apos;ve been drawing for as long as I can remember. Checkout my art instagram <Link
                    passHref
                    target="_blank"
                    href='https://instagram.com/galleon_art'>
                        @galleon_art
                    </Link> to see my stuff.
                </p>
                <p className='lg:ml-auto lg:w-4/6 '>
                    I&apos;m also a keen musician. I&apos;ve released 5 albums over the years. You can stream them on all platforms, <Link
                        passHref
                        target="_blank"
                        href="https://linktr.ee/galleonofficial">listen here.</Link>
                </p>
                <Image
                    priority={true}
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="w-full h-auto object-cover"
                    src={meCreative} alt="A picture of Ben Toms"/>
            </div>
        </div>
    )
}
