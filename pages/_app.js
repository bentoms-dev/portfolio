import '../styles/globals.css'
import ReactGA from 'react-ga';
  const TRACKING_ID = "G-86E829YV2S"; // OUR_TRACKING_ID
  ReactGA.initialize(TRACKING_ID);

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
