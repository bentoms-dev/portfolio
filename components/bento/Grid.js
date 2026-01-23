import React from 'react';
import ProfileTile from './ProfileTile';
import TechStackTile from './TechStackTile';
import MusicTile from './MusicTile';
import ArtTile from './ArtTile';
import ProjectTile from './ProjectTile';
import StatsTile from './StatsTile';
import GithubTile from './GithubTile';

export default function BentoGrid() {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 lg:p-10 flex flex-col items-center justify-center">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(180px,auto)] gap-4">

                {/* Row 1: Profile (Large) + Stats + Social */}
                <ProfileTile />
                <StatsTile />
                <GithubTile />

                {/* Row 2: Tech Stack (Tall) + Projects */}
                <TechStackTile />
                <ProjectTile
                    title="CLI Genie"
                    description="Easily create interactive command-line interfaces (CLIs) with a genie-style interface"
                    type="NPM Package"
                    downloads="2.5k+"
                    link="https://www.npmjs.com/package/cli-genie"
                    color="bg-blue-500"
                    delay={0.1}
                />
                <ProjectTile
                    title="Config Ease"
                    description="Simplifies the management of dynamic configurations in Node.js applications"
                    type="NPM Package"
                    downloads="1.2k+"
                    link="https://www.npmjs.com/package/config-ease"
                    color="bg-purple-500"
                    delay={0.2}
                />
                <ProjectTile
                    title="Shopify Compressor"
                    description="A powerful, modern asset compressor and optimizer for Shopify themes."
                    type="NPM Package"
                    downloads="800+"
                    link="https://www.npmjs.com/package/shopify-compressor"
                    color="bg-green-500"
                    delay={0.3}
                />

                {/* Row 3: More Projects + Accents (Music/Art) */}
                <ProjectTile
                    title="Subway Game"
                    description="Retro terminal-style game built with Javascript & WebGL"
                    type="Web Game"
                    link="/subway-game"
                    color="bg-yellow-500"
                    delay={0.4}
                />
                 <MusicTile />
                 <ArtTile />
                 <ProjectTile
                    title="DJenerator"
                    description="Generate MIDI for Djent rhythms and polyrhythms"
                    type="Open Source"
                    link="https://github.com/bentoms-dev/djenerator"
                    color="bg-pink-500"
                    delay={0.5}
                />
            </div>
        </div>
    );
}
