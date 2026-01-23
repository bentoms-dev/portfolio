import Head from 'next/head'

export default function Header() {
    return (
        <Head>
        <title>Ben Toms :: Developer, Creative, Musician</title>
        <meta name="description" content="Portfolio of Ben Toms. Developer, Creative, Musician. Exploring the intersection of code, art, and sound." />
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
