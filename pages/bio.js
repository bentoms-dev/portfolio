import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft, MapPin } from 'lucide-react'

export default function Bio() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-purple-500/30 selection:text-white">
      <Head>
        <title>Ben Toms :: The Story</title>
        <meta name="description" content="My professional journey and philosophy." />
      </Head>

      <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20">

        {/* Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Grid
        </Link>

        {/* Header */}
        <header className="mb-16">
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Lead.</span>
          </h1>
          <p className="text-xl lg:text-2xl font-light leading-relaxed text-slate-400">
            Designing solutions, steering projects, and leading brilliant teams.
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-12">

          <section>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
              The Role
            </h2>
            <div className="prose prose-invert prose-lg text-slate-400 leading-relaxed">
              <p className="mb-6">
                I&apos;ve been in web development for over 16 years, and now I&apos;m a <strong>Technical Lead</strong>, designing solutions, steering projects, and leading brilliant teams to deliver work we can all be proud of. My role is part architect, part problem-solver, and part mentor. I spend a lot of time mapping out how things should be built, making key technical decisions, and making sure everyone on the team has what they need to do their best work.
              </p>
            </div>
          </section>

          <section>
             <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
              The Tech
            </h2>
            <div className="prose prose-invert prose-lg text-slate-400 leading-relaxed">
                <p className="mb-6">
                    When I do get hands-on, it&apos;s usually building Node-based tools, apps, features, or backend processes, often for Shopify stores—the kind of things that quietly power the front end and make a big difference to performance, maintainability, and developer experience.
                </p>
                <p>
                    My background in <strong>JavaScript, CSS, HTML, React, and Vue</strong> means I can jump into the front end when needed, and it also helps me bridge conversations between disciplines so the right solution comes together smoothly.
                </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-pink-500 rounded-full"></span>
              The Human Side
            </h2>
            <div className="prose prose-invert prose-lg text-slate-400 leading-relaxed">
              <p className="mb-6">
                What I enjoy most now is the <strong>human side of tech</strong>: collaborating with smart, creative people, mentoring developers, unblocking tricky problems, and watching the things we&apos;ve built actually get used in the real world.
              </p>
              <p>
                 Seeing our work make a difference, whether that&apos;s a seamless checkout, a time-saving internal tool, or a feature users genuinely love, is still the best part of the job.
              </p>
            </div>
          </section>

          <section className="pt-10 border-t border-white/10">
             <div className="flex flex-wrap gap-6 justify-center">
                 <div className="flex items-center gap-3 text-slate-400">
                    <MapPin size={20} /> Alicante, Spain
                 </div>
             </div>
          </section>

        </div>
      </div>
    </div>
  )
}
