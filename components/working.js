import React from "react";

export default function Working() {
    return (
        <>
            <div className='grid grid-cols-1 text-left'>
                <h2 className='text__pull-up'>WHAT I LIKE <span className='hidden lg:inline-block'>WORKING WITH</span></h2>
                <ul className='list-none columns-3 w-25'>
                    <li>javascript</li>
                    <li>react</li>
                    <li>nextjs</li>
                    <li>git</li>
                    <li>html</li>
                    <li>scss</li>
                    <li>kali</li>
                    <li>ci/cd</li>
                    <li>coffee</li>
                </ul>
            </div>
            <div className='grid grid-cols-1 text-left lg:text-right lg:justify-items-end mb-10 lg:mb-28'>
                <h2 className='text__pull-up hidden lg:block'>WHAT I LIKE WORKING ON</h2>
                <ul className='list-none columns-3 lg:columns-2 w-25'>
                    <li>e-commerce</li>
                    <li>apps</li>
                    <li>dashboards</li>
                    <li>perf</li>
                    <li>pen test</li>
                    <li>npm packages</li>
                </ul>
            </div>
        </>
    )
}