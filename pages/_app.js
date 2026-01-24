import '../styles/globals.css'
import ReactGA from 'react-ga';
  const TRACKING_ID = "G-86E829YV2S"; // OUR_TRACKING_ID
  ReactGA.initialize(TRACKING_ID);

import Header from '../components/Header';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
