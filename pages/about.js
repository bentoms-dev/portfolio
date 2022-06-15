import Header from '../components/header'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import picture from '.././public/ben-toms-about-2.jpg';
import picture2 from '.././public/ben-toms-about-3.jpg';

export default function About() {
  return (
    <div>
        <Header/>
        <Sidebar/>
        <div className={styles.container}>

            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex justfiy-center">
                        <Image
                        className="w-screen h-screen object-cover object-top"
                        src={ picture }
                        alt="Ben Toms Portrait"
                        />
                    </div>
                    <div className="flex text-gray-800 justify-center">
                        <div className="mb-auto mt-auto max-w-xlg bg-white p-10">
                        <h1 className="max-w-lg mb-1 font-sans text-3xl font-bold leading-none tracking-tight text-gray-800 sm:text-4xl">
                            Ben Toms
                        </h1>
                        <p className="font-semibold mb-5">Fullstack Developer</p>
                        <p className="mb-5">
                            With 14+ years experience, I understand what makes a site flow and the importance of strong code.
                            My design, music and art background allows me to bring a uniquely influenced style to my work that most developers don&apos;t have.
                        </p>
                        <p className="mb-5">
                            I have over 6 years experience developing in E-Commerce environments for international brands such as Dr. Martens, Missoma and CaféDirect.
                        </p>
                        <p className="mb-5">
                            I&apos;ve also spent a few years freelancing around London agencies, working on multiple projects for global companies such as Samsung, ExxonMobil and Spotify which lead to extensive knowledge in both B2B and B2C as well as developing excellent client facing skills.
                        </p>
                        <p className="mb-5">
                            My love for the Front-End gives me proficiencies in HTML, CSS, VanillaJS, PHP, MySQL and I&apos;m also highly experienced in NodeJS, NextJS, ReactJs and React Native as well as the popular CMS foundations WordPress, Shopify, Umbraco and Hybris.
                        </p>
                        <p className="mb-5">
                            I am also highly experienced in building Headless CMS solutions and using cloud platforms such as AWS, Netlify and Heroku.
                        </p>
                        <a href="mailto:me@ben-toms.com"><button className="bg-neutral-900 hover:bg-neutral-400 rounded-md py-3 px-7 mt-6 text-white">Let&apos;s go</button></a>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 mt-10 mb-10'>
                    <div className="text-white bg-neutral-900 px-5 py-5 md:p-10 text-center">
                        <h2 className="font-serif text-2xl md:text-6xl mb-10">I&apos;ve always had a passion for building applications</h2>
                        <p>Creating features and functions that people can interact with is really exicting for me.</p>
                        <p>This is why I love working in the B2C sector as I get to see how people interact with the products I put out and I learn and improve from the feedback.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">

                    <div className="flex text-gray-800 justify-center">
                        <div className="w-screen bg-white p-10">
                            <h2 className="font-semibold text-xl">What I like working with</h2>
                            <ul className='mb-5'>
                                <li>Javascript (ES6+)</li>
                                <li>React</li>
                                <li>Next</li>
                                <li>SCSS</li>
                                <li>HTML</li>
                                <li>Git</li>
                            </ul>
                            <h2 className="font-semibold text-xl">What I like working on</h2>
                            <ul>
                                <li>E-commerce sites</li>
                                <li>Apps</li>
                                <li>User dashboards</li>
                                <li>Performance improvements</li>
                                <li>Penetration testing</li>
                                <li>Fun projects</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex justfiy-center">
                        <Image
                        className="w-screen h-screen object-cover object-top"
                        src={ picture2 }
                        alt="Ben Toms landscape"
                        />
                    </div>
                 </div>
            </div>
            <Footer/>
        </div>
    </div>
   )
}
