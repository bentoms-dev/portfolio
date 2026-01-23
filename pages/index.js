import Head from 'next/head'
import BentoGrid from '../components/bento/Grid'
import Footer from '../components/footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Ben Toms :: Development Industry Leader</title>
        <meta name="description" content="Ben Toms. Developer, Creative, Musician. Industry Leader." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <BentoGrid />
      <Footer />
    </>
  )
}
