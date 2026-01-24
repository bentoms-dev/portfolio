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
                {/* Profile takes 2x2, so it occupies Row 1 & 2, Cols 1 & 2 */}
                <ProfileTile />
                <StatsTile />
                <GithubTile />

                {/* Row 2: Tech Stack + Music (Fills the remaining 2 cols next to Profile) */}
                <TechStackTile />
                <MusicTile />

                {/* Row 3: Categories + Art + Filler/Future */}
                <ProjectTile
                    title="NPM Packages & Tools"
                    description="Open source libraries, CLIs and dev tools."
                    type="Collection"
                    link="/npm-packages"
                    color="bg-blue-500"
                    colSpan={1}
                    delay={0.3}
                />
                 <ProjectTile
                    title="Web Games"
                    description="Interactive visualization and browser games."
                    type="Collection"
                    link="/games"
                    color="bg-yellow-500"
                    colSpan={1}
                    delay={0.4}
                />
                 <ArtTile />
                 {/* Placeholder for future or make Art/Music bigger? For now keeping 4x grid consistent */}
                 <ProjectTile
                    title="Contact"
                    description="Get in touch for collaborations."
                    type="Link"
                    link="mailto:me@ben-toms.com"
                    color="bg-slate-600"
                    delay={0.5}
                />
            </div>
        </div>
    );
}
