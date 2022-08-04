import Head from 'next/head'

export default function Header() {
    return (
        <Head>
        <title>Ben Toms :: Fullstack Web Developer</title>
        <meta name="description" content="Experienced front-end expert. Specialising in Javascript and E-commerce." />
        <link rel="icon" href="/favicon.ico" />
        <link
            rel="preload"
            href="./../public/fonts/pprightsans-tallregular-webfont.woff2"
            as="font"
            crossOrigin=""
            type="font/woff2"
        />
        <link
            rel="preload"
            href="./../public/fonts/pprightsans-tallregular-webfont.woff"
            as="font"
            crossOrigin=""
            type="font/woff"
        />
        </Head>
     )
}
