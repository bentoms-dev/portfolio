import Header from '../components/header'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import picture from '.././public/ben-toms-about.jpg';

export default function About() {
  return (
    <div>
        <Header/>
        <Sidebar/>
        <div className={styles.container}>

            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
                    <div className="flex text-gray-800 p-10">
                        <Image
                        className="w-screen h-screen object-cover object-top"
                        src={ picture }
                        alt="" />
                    </div>
                    <div className="flex text-gray-800 p-10">
                        <div className="mb-auto mt-auto max-w-lg">
                        <h1 className="max-w-lg mb-1 font-sans text-3xl font-bold leading-none tracking-tight text-gray-800 sm:text-4xl mx-auto">
                            Ben Toms
                        </h1>
                        <p className="font-semibold mb-5">Fullstack Developer</p>
                        <p className="mb-5">
                            With 13+ years experience, I understand what makes a site flow and the importance of strong code.
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
                            I am also strongly experienced in building Headless CMS solutions and using cloud platforms such as AWS, Netlify and Heroku.
                        </p>
                        <a href="mailto:me@ben-toms.com"><button className="bg-gray-800 hover:bg-gray-400 rounded-md py-3 px-7 mt-6 text-white">Email Me</button></a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    </div>
   )
}
