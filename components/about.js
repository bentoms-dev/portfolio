import Image from 'next/image'
import Link from 'next/link'
import me from '.././public/ben-toms-2.jpeg'
import styles from '../styles/Home.module.css'

export default function About() {
    return (
    <div className='container'>
        <div className={styles.container}>
            <div className='grid grid-cols-1 lg:grid-cols-3 justify-items-end mb-10 lg:mb-28'>
                <div className='grid grid-cols-1 md:grid-cols-3 col-span-2'>
                    <div className='grid grid-cols-1'>
                        <Image
                        className="lg:w-screen lg:h-screen object-fit object-contain lg:object-cover"
                        src={me} alt="A picture of Ben Toms"/>
                        <span>
                            BEN TOMS
                        </span>
                        <Link
                            passHref
                            href="mailto:me@ben-toms.com"
                            target="_blank"
                        >
                            Ready to talk? Let&apos;s go →
                        </Link>
                    </div>
                    <div className='grid lg:pr-28 lg:pl-4 lg:col-span-2'>
                        <h1 className='text__pull-up'>DEVELOPER</h1>
                        <p><span className="text__callout">I&apos;VE BEEN DOING THIS A LONG TIME.</span> With 14+ years experience, I have seen it all. I&apos;ve been through site migrations, replatforms, 5am launches, 2am emergency calls, ridiculous bugs and much more.</p>
                        <p>I have over 6 years experience developing in E-Commerce environments for international brands such as Dr. Martens, Missoma and Samsung. I&apos;ve also spent a few years freelancing around London agencies, working on multiple projects for global companies such as Samsung, ExxonMobil and Spotify which lead to extensive knowledge in both B2B and B2C as well as developing excellent client facing skills.</p>
                        <p>My love for the Front-End gives me proficiencies in HTML, CSS, VanillaJS, PHP, MySQL and I&apos;m also highly experienced in NodeJS, NextJS, ReactJs and React Native as well as the popular CMS foundations WordPress, Shopify and Hybris.</p>
                        <p>I am also highly experienced in building Headless CMS solutions and using cloud platforms such as AWS, Netlify and Heroku.</p>
                    </div>
                </div>
                <div className='lg:text-right grid lg:pl-17'>
                    <h2 className='text__push-down'>LEADER</h2>
                    <p><span className="text__callout">BUILDING THE DREAM TEAM.</span> I&apos;ve had many opportunities in my career to be in the position of building and leading development teams. From a small 3 piece to a strong 6 I&apos;ve been able to mentor, shape and also learn from other developers. I have a passion for training others and also learning from them. I&apos;m never going to pretend to know everything because that&apos;s never possible. </p>
                </div>
            </div>
            <div className='grid grid-cols-1 justify-items-center text-center mb-10 lg:mb-28'>
                <span className="w-full p-0-2 bg-white lg:w-1/3 mb-10"></span>
                <p>
                <span className="text__callout">I&apos;VE ALWAYS HAS A PASSING FOR BUILDING APPLICATIONS.</span> Creating features and functions that people can interact with is really excfiting for me.<br/>
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
            <div className='grid grid-cols-1 text-left lg:text-right lg:justify-items-end'>
                <h2 className='text__pull-up hidden lg:block'>WHAT I LIKE WORKING ON</h2>
                <ul className='list-none columns-3 lg:columns-2 w-25'>
                    <li>e-commerce</li>
                    <li>apps</li>
                    <li>dashboads</li>
                    <li>perf</li>
                    <li>pen test</li>
                    <li>challenges</li>
                </ul>
            </div>
        </div>
    </div>
    )
}
