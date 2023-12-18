import Header from '../components/header'
import Footer from '../components/footer'
import Topbar from '../components/topBar'
import About from '../components/about'

import LoadingSpinner from './LoadingSpinner'
import { useEffect, useState } from 'react'

export default function Home() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000);

    return () => clearTimeout(timeout)
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={'fade'}>
        <Header/>
        <Topbar />
        <About/>
        <Footer/>
        </div>
      )}
    </div>
  )
}
