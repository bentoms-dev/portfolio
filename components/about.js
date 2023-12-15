import Image from 'next/image'
import Link from 'next/link'
import me from '.././public/ben-toms-2.jpeg'
import meCreative from '.././public/ben-toms-creative.jpg'
import styles from '../styles/Home.module.css'
import Popup from '../components/popup'

export default function About() {
    return (
    <div className='container'>
        <div className={styles.container}>
            <div className='grid grid-cols-1 lg:grid-cols-3 justify-items-end mb-10 lg:mb-28'>
                <div className='grid grid-cols-1 md:grid-cols-3 col-span-2'>
                    <div className='grid grid-cols-1'>
                        <Image
                        priority={true}
                        className="lg:w-screen lg:h-screen object-fit object-contain lg:object-cover"
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
                <div className='lg:text-right grid lg:pl-17'>
                    <h2 className='text__push-down'>LEADER</h2>
                    <p><span className="text__callout">BUILDING THE DREAM TEAM.</span> I&apos;ve had many opportunities in my career to be in the position of building and leading development teams. From a small 3 piece to a strong 6 I&apos;ve been able to mentor, shape and also learn from other developers. I have a passion for training others and also learning from them. I&apos;m never going to pretend to know everything because that&apos;s isn&apos;t possible. </p>
                </div>
            </div>
            <div className='grid grid-cols-1 justify-items-center text-center mb-10 lg:mb-28'>
                <span className="w-full p-0-2 bg-white lg:w-1/3 mb-10"></span>
                <p>
                <span className="text__callout">I&apos;VE ALWAYS HAS A PASSION FOR BUILDING APPLICATIONS.</span> Creating features and functions that people can interact with is really exciting for me.<br/>
                    This is why I love working in the B2C sector as I get to see how people interact with the products I put out and I learn and improve from the feedback.
                </p>
                <span className="w-full p-0-2 bg-white lg:w-1/3 mt-10"></span>
            </div>
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
            <div className='grid'>
                <span className="w-full p-4 lg:p-10 bg-lime-400 lg:w-100 mb-10"></span>
            </div>
            <div className='grid grid-cols-1 text-center '>
                <h3>WHO I&apos;VE WORKED WITH</h3>
                <ul className='worked-with list-none text-center flex flex-col lg:flex-row lg:justify-between'>
                    <li className='display'>missoma</li>
                    <li className='display'>samsung</li>
                    <li className='display'>dr. martens</li>
                    <li className='display'>tesco</li>
                    <li className='display'>spotify</li>
                    <li className='display'>cafédirect</li>
                    <li className='display'>exonmobil</li>
                    <li className='display'>hitachi</li>
                </ul>
            </div>
        </div>
        <div className='grid mb-10 lg:mb-28'>
            <span className="w-full p-4 lg:p-10 bg-lime-400 lg:w-100 mb-10"></span>
        </div>
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
                    className="lg:w-screen lg:h-screen object-fit object-contain lg:object-cover"
                    src={meCreative} alt="A picture of Ben Toms"/>
            </div>
        </div>
        <div className='grid'>
                <span className="w-full p-4 lg:p-10 bg-lime-400 lg:w-100 mb-10"></span>
            </div>
            <div className='grid grid-cols-1 text-center section__projects'>
                <h3>PERSONAL PROJECTS</h3>
                <ul className='worked-with list-none text-center flex flex-col lg:flex-row lg:justify-between'>
                    <li className='display'>
                        <Link
                            passHref
                            target="_blank"
                            href='https://www.npmjs.com/package/cli-genie'>CLI GENIE</Link>
                    </li>
                    <li className='display'>
                        <Link
                            passHref
                            target="_blank"
                            href='https://www.npmjs.com/package/shopify-compressor'>SHOPIFY COMPRESSOR</Link>
                    </li>
                    <li className='display'>
                        <Link
                            passHref
                            target="_blank"
                            href='https://www.npmjs.com/package/config-ease?activeTab=readme'>CONFIG EASE</Link>
                    </li>
                    <li className='display'>
                        <Link
                            passHref
                            target="_blank"
                            href='https://github.com/bentoms-dev/djenerator'>DJENERATOR</Link>
                    </li>
                </ul>
            </div>
    </div>
    )
}
