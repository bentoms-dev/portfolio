import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 lg:p-6 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent pointer-events-none">
            <Link href="/" className="pointer-events-auto hover:opacity-80 transition-opacity">
                <Image
                    src="/logo-bentoms.svg"
                    alt="Ben Toms Logo"
                    width={300}
                    height={80}
                    className="h-16 lg:h-24 w-auto"
                    priority
                />
            </Link>
        </header>
    );
}
