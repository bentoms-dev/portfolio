import React from 'react';

import styles from '../styles/Home.module.css'
import Intro from './intro'
import Leader from './leader'
import CallOut from './callout'
import Working from './working'
import Experience from './experience'
import Creative from './creative'
import Projects from './projects'

export default function About() {
    return (
    <div className='container'>
        <div className={styles.container}>
            <div className='grid grid-cols-1 lg:grid-cols-3 justify-items-end mb-10 lg:mb-28'>
                <Intro />
                <Leader />
            </div>
            <CallOut />
            <Working />
            <div className='grid'>
                <span className="w-full p-4 lg:p-10 bg-lime-400 lg:w-100 mb-10"></span>
            </div>
            <Experience />
        </div>
        <div className='grid mb-10 lg:mb-28'>
            <span className="w-full p-4 lg:p-10 bg-lime-400 lg:w-100 mb-10"></span>
        </div>
       <Creative />
        <div className='grid'>
            <span className="w-full p-4 lg:p-10 bg-lime-400 lg:w-100 mb-10"></span>
        </div>
        <Projects />
    </div>
    )
}
