import Header from '../components/header'
import Footer from '../components/footer'
import Sidebar from '../components/sidebar'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import avatar from '.././public/avatar.jpg';
import missoma from '.././public/projects/missoma.png';
import drmartens from '.././public/projects/drmartens.png';
import dracbat from '.././public/projects/dracbat.png';

export default function Home() {
  return (
    <div>
      <Header/>
      <Sidebar/>
      <div className={styles.container}>
        <div>
          <div className="px-4 sm:py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
            <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
              <div className="flex flex-col mb-16 sm:text-center sm:mb-0">
                <div className="flex items-center justify-center w-30 h-30 rounded-full mb-6">
                  <Image
                    src={ avatar }
                    alt="Picture of Ben Toms"
                    className="inline object-cover w-16 h-16 mr-2 rounded-full"
                    width={300}
                    height={300}/>
                </div>
                <div className="max-w-xl mb-10 mx-auto text-center lg:max-w-2xl md:mb-12">
                  <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-800 sm:text-4xl mx-auto">
                    Ben Toms
                  </h2>
                  <p className="text-base text-gray-700 md:text-lg mb-5">
                    Fullstack Web Developer
                  </p>
                  <p className="text-base text-gray-700 md:text-sm mb-3">
                    With 14+ years experience, I understand what makes a site flow and the importance of strong code.<br/>
                    My design, music and art background allows me to bring a uniquely influenced style to my work that most developers don&apos;t have...
                  </p>
                  <div className="flex items-center justify-center mt-3">
                    <Link
                      passHref
                      className="flex items-center text-gray-700 hover:underline hover:text-gray-400"
                      href="/about"><span>Get to the good stuff &rarr;</span>
                    </Link>
                  </div>
                </div>
                <div className="mx-auto">
                  <a
                    href="https://github.com/bentoms-dev"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white hover:bg-gray text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center mx-5">
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    <span>Github</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/bentoms/"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white hover:bg-gray text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center mx-5">
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    <span>Linkedin</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="big-text text-center sm:my-16 my-5">
          <h2 className="font-black text-7xl sm:text-9xl bg-gray-100 mix-blend-lighten uppercase">for the <br/> love of code</h2>
        </div>
        <section className="bg-gray-800 py-20">
          <div className="max-w-5xl px-6 mx-auto text-center">
              <h2 className="text-2xl font-semibold text-white">Projects</h2>
              <div className="flex items-center justify-center mt-10">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="max-w-xs w-full">
                          <div className="flex items-center justify-center h-56 bg-white border-b-8 border-teal-400 rounded-md overflow-hidden">
                              <Image
                                src={ missoma }
                                alt="Picture of Missoma"
                                className="object-cover h-8"
                                width={300}
                                height={300}/>
                          </div>

                          <a href="https://uk.missoma.com" className="block bg-gray-700 mt-5 rounded-md overflow-hidden transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                              <div className="py-2 px-3 text-center text-sm">
                                  <p className="text-gray-300">Missoma</p>

                                  <span className="block text-gray-500 mt-2">missoma.com</span>
                              </div>
                          </a>
                      </div>

                      <div className="max-w-xs w-full">
                          <div className="flex items-center justify-center h-56 bg-white border-b-8 border-teal-400 rounded-md overflow-hidden">
                          <Image
                                src={ drmartens }
                                alt="Picture of Dr. Martens"
                                className="object-cover h-8"
                                width={300}
                                height={300}/>
                          </div>

                          <a href="https://drmartens.com" className="block bg-gray-700 mt-5 rounded-md overflow-hidden transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                              <div className="py-2 px-3 text-center text-sm">
                                  <p className="text-gray-300">Dr. Martens</p>

                                  <span className="block text-gray-500 mt-2">drmartens.com</span>
                              </div>
                          </a>
                      </div>

                      <div className="max-w-xs w-full">
                          <div className="flex items-center justify-center h-56 bg-white border-b-8 border-teal-400 rounded-md overflow-hidden">
                          <Image
                                src={ dracbat }
                                alt="Picture of dracbat"
                                className="object-cover h-8"
                                width={300}
                                height={300}/>
                          </div>

                          <a href="https://play.google.com/store/apps/details?id=com.galleongamescompany.dracbat" className="block bg-gray-700 mt-5 rounded-md overflow-hidden transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                              <div className="py-2 px-3 text-center text-sm">
                                  <p className="text-gray-300">Dracbat</p>

                                  <span className="block text-gray-500 mt-2">Google Play</span>
                              </div>
                          </a>
                      </div>

                      <div className="max-w-xs w-full">
                        <a href="#" className="block bg-gray-700 mt-5 rounded-md overflow-hidden">
                          <div className="py-2 px-3 text-center text-sm">
                              <p className="text-gray-300">Ernalow Property</p>
                          </div>
                        </a>
                      </div>

                      <div className="max-w-xs w-full">
                        <a href="#" className="block bg-gray-700 mt-5 rounded-md overflow-hidden">
                          <div className="py-2 px-3 text-center text-sm">
                              <p className="text-gray-300">SalonSystem</p>
                          </div>
                        </a>
                      </div>

                      <div className="max-w-xs w-full">
                        <a href="#" className="block bg-gray-700 mt-5 rounded-md overflow-hidden">
                          <div className="py-2 px-3 text-center text-sm">
                              <p className="text-gray-300">CaféDirect</p>
                          </div>
                        </a>
                      </div>

                      <div className="max-w-xs w-full">
                        <a href="#" className="block bg-gray-700 mt-5 rounded-md overflow-hidden">
                          <div className="py-2 px-3 text-center text-sm">
                              <p className="text-gray-300">Spotify</p>
                          </div>
                        </a>
                      </div>

                      <div className="max-w-xs w-full">
                        <a href="#" className="block bg-gray-700 mt-5 rounded-md overflow-hidden">
                          <div className="py-2 px-3 text-center text-sm">
                              <p className="text-gray-300">Tesco</p>
                          </div>
                        </a>
                      </div>

                      <div className="max-w-xs w-full">
                        <a href="#" className="block bg-gray-700 mt-5 rounded-md overflow-hidden">
                          <div className="py-2 px-3 text-center text-sm">
                              <p className="text-gray-300">ExxonMobil</p>
                          </div>
                        </a>
                      </div>

                      <div className="max-w-xs w-full">
                        <a href="#" className="block bg-gray-700 mt-5 rounded-md overflow-hidden">
                          <div className="py-2 px-3 text-center text-sm">
                              <p className="text-gray-300">London Real</p>
                          </div>
                        </a>
                      </div>

                      <div className="max-w-xs w-full">
                        <a href="#" className="block bg-gray-700 mt-5 rounded-md overflow-hidden">
                          <div className="py-2 px-3 text-center text-sm">
                              <p className="text-gray-300">Samsung</p>
                          </div>
                        </a>
                      </div>

                      <div className="max-w-xs w-full">
                        <a href="#" className="block bg-gray-700 mt-5 rounded-md overflow-hidden">
                          <div className="py-2 px-3 text-center text-sm">
                              <p className="text-gray-300">Hitachi Capital</p>
                          </div>
                        </a>
                      </div>
                  </div>
              </div>

              <div className="flex items-center justify-center mt-12">
                  <a className="flex items-center text-white hover:underline hover:text-gray-200"
                    href="https://github.com/bentoms-dev"
                    target="_blank"
                    rel="noreferrer">
                      <span>View More On Github</span>

                      <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                  </a>
              </div>
          </div>
      </section>
      <Footer/>
    </div>
  </div>
  )
}
