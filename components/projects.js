import React from "react";
import Link from 'next/link'

export default function Projects() {

    return (
        <div className='grid grid-cols-1 text-center section__projects'>
            <h3>PERSONAL PROJECTS</h3>
            <ul className='worked-with list-none text-center flex flex-col lg:flex-row lg:justify-between'>
                <li className='display'>
                    <Link passHref href='/subway-game'>TERMINAL</Link>
                </li>
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
                        href='https://www.npmjs.com/package/config-ease'>CONFIG EASE</Link>
                </li>
                <li className='display'>
                    <Link
                        passHref
                        target="_blank"
                        href='https://www.npmjs.com/package/textcraft-pro-editor'>TEXTCRAFT PRO</Link>
                </li>
                <li className='display'>
                    <Link
                        passHref
                        target="_blank"
                        href='https://github.com/bentoms-dev/djenerator'>DJENERATOR</Link>
                </li>
            </ul>
        </div>
    )
}
