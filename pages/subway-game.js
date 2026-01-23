import Head from 'next/head'
import Link from 'next/link'

import Footer from '../components/footer'
import Topbar from '../components/topBar'

export default function SubwayGame() {
    return (
        <div className="min-h-screen bg-slate-900">
            <Head>
                <title>Terminal — The Game</title>
                <meta name="description" content="Terminal — a WebGL game." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <Topbar />

            <main className="px-4 pb-8">
                <div className="max-w-full mx-auto">
                    <div className="flex items-center justify-between text-white mb-3">
                        <Link passHref href="/">
                            Back to site
                        </Link>
                    </div>

                    <div className="w-full overflow-hidden rounded border border-slate-700 shadow-lg bg-black">
                        <iframe
                            src="/subway-game/index.html"
                            title="Terminal - The Game"
                            className="w-full"
                            style={{ height: '82vh' }}
                            allow="fullscreen"
                        />
                    </div>

                    <p className="text-slate-300 text-xs mt-3">
                        Tip: click inside the game to capture keyboard controls.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
}
