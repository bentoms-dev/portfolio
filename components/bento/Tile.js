import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Tile({
    children,
    className,
    colSpan = 1,
    rowSpan = 1,
    delay = 0
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            className={cn(
                "group relative overflow-hidden rounded-3xl bg-white/5 p-6 border border-white/10 hover:border-white/20 transition-colors",
                // Grid positioning classes
                colSpan === 2 ? "md:col-span-2" : "md:col-span-1",
                rowSpan === 2 ? "md:row-span-2" : "md:row-span-1",
                className
            )}
        >
            {/* Glossy gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </motion.div>
    );
}
