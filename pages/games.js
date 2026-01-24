import Head from 'next/head';
import ProjectTile from '../components/bento/ProjectTile';
import Footer from '../components/footer';
import { games } from '../data/projects';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Games() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            <Head>
                <title>Games :: Ben Toms</title>
                <meta name="description" content="Web games built by Ben Toms." />
            </Head>

            <main className="flex-grow p-4 lg:p-10 flex flex-col items-center">
                <div className="max-w-7xl w-full">
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-4">
                            <ArrowLeft size={20} className="mr-2" />
                            Back to Home
                        </Link>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                            Games
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Interactive web games and experiments.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
                        {games.map((game, index) => (
                            <ProjectTile
                                key={index}
                                {...game}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
