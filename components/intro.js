import React from "react";
import Image from 'next/image'
import me from '.././public/ben-toms-2.jpeg'
import Popup from './popup'

export default function Intro(){

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 col-span-2'>
        <div className='grid grid-cols-1'>
            <Image
            priority={true}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="w-full h-auto object-cover"
            src={me} alt="A picture of Ben Toms"/>
            <span className='italic'>
                BEN TOMS
            </span>
            <span className="link__highlight">
                <Popup />
            </span>
        </div>
        <div className='grid lg:pr-28 lg:pl-4 lg:col-span-2'>
            <h1 className='text__pull-up'>DEVELOPER</h1>
            <p><span className="text__callout">I&apos;VE BEEN DOING THIS A LONG TIME.</span> With 15+ years experience, I have seen it all. I&apos;ve been through site migrations, replatforms, 5am launches, 2am emergency calls, ridiculous bugs and much more.</p>
            <p>I have over 6 years experience developing in E-Commerce environments for international brands such as Dr. Martens, Missoma and Samsung. I&apos;ve also spent a few years freelancing around London agencies, working on multiple projects for global companies such as Samsung, ExxonMobil and Spotify which lead to extensive knowledge in both B2B and B2C as well as developing excellent client facing skills.</p>
            <p>My love for the Front-End gives me proficiencies in HTML, CSS, JS, NodeJS, NextJS, ReactJS and React Native as well as the popular CMS foundations WordPress, Shopify and Hybris.</p>
            <p>I am also highly experienced in building Headless CMS solutions and using cloud platforms such as AWS, Netlify, Shopify Oxygen and Heroku.</p>
        </div>
    </div>
    )
}
