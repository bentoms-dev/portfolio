import React from "react";

export default function Working() {
    return (
        <>
        <>
            <div className='grid grid-cols-1 text-left mb-10'>
                <h2 className='text__pull-up text-5xl mb-6'>TOOLKIT</h2>
                <p className="mb-6 text-lg"><span className="text__callout">MY CRAFT.</span> The tools and technologies I use to bring ideas to life.</p>
                <ul className='list-none columns-3 w-25 text-lg'>
                    <li>javascript</li>
                    <li>react</li>
                    <li>nextjs</li>
                    <li>node.js</li>
                    <li>html5</li>
                    <li>tailwind</li>
                    <li>typescript</li>
                    <li>git</li>
                    <li>aws</li>
                </ul>
            </div>
            <div className='grid grid-cols-1 text-left lg:text-right lg:justify-items-end mb-10 lg:mb-28'>
                <h2 className='text__pull-up hidden lg:block text-5xl mb-6'>FOCUS AREAS</h2>
                 <h2 className='text__pull-up lg:hidden text-5xl mb-6'>FOCUS AREAS</h2>
                <ul className='list-none columns-2 w-25 text-lg'>
                    <li>creative coding</li>
                    <li>interactive ui</li>
                    <li>audio synthesis</li>
                    <li>performance</li>
                    <li>3d / webgl</li>
                    <li>generative art</li>
                </ul>
            </div>
        </>
        </>
    )
}
