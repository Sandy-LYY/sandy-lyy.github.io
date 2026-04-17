'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    EnvelopeIcon,
    AcademicCapIcon,
    HeartIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import { MapPinIcon as MapPinSolidIcon, EnvelopeIcon as EnvelopeSolidIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Github, Linkedin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useMessages } from '@/lib/i18n/useMessages';

// Custom ORCID icon component
const OrcidIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    features: SiteConfig['features'];
    researchInterests?: string[];
}

export default function Profile({ author, social, features, researchInterests }: ProfileProps) {
    const messages = useMessages();

    const [hasLiked, setHasLiked] = useState(false);
    const [showThanks, setShowThanks] = useState(false);

    useEffect(() => {
        if (!features.enable_likes) return;

        const userHasLiked = localStorage.getItem('jiale-website-user-liked');
        if (userHasLiked === 'true') {
            setHasLiked(true);
        }
    }, [features.enable_likes]);

    const handleLike = () => {
        const newLikedState = !hasLiked;
        setHasLiked(newLikedState);

        if (newLikedState) {
            localStorage.setItem('jiale-website-user-liked', 'true');
            setShowThanks(true);
            setTimeout(() => setShowThanks(false), 2000);
        } else {
            localStorage.removeItem('jiale-website-user-liked');
            setShowThanks(false);
        }
    };

    const titleLines = (author.title || '').split('\n').map((s) => s.trim()).filter(Boolean);

    const extraSocialRows: Array<{
        key: string;
        label: string;
        href: string;
        icon: React.ComponentType<{ className?: string }>;
    }> = [
        ...(social.google_scholar
            ? [{ key: 'scholar', label: 'Google Scholar', href: social.google_scholar, icon: AcademicCapIcon }]
            : []),
        ...(social.orcid ? [{ key: 'orcid', label: 'ORCID', href: social.orcid, icon: OrcidIcon }] : []),
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="sticky top-8"
        >
            <div className="w-64 h-64 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Image
                    src={author.avatar}
                    alt={author.name}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover object-[32%_center]"
                    priority
                />
            </div>

            <div className="text-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                    {author.name}
                </h1>
                <div className="text-lg text-accent font-medium mb-1 space-y-0.5">
                    {titleLines.length > 0 ? (
                        titleLines.map((line, idx) => (
                            <p key={idx}>{line}</p>
                        ))
                    ) : (
                        <p>{author.title}</p>
                    )}
                </div>
                {author.institution && (
                    <p className="text-neutral-600 mb-2">
                        {author.institution}
                    </p>
                )}
            </div>

            <div className="mb-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/40 px-4 py-4">
                <div className="flex flex-col gap-4 text-left text-sm text-primary">
                    {(social.location || (social.location_details && social.location_details.length > 0)) && (
                        <div className="flex gap-3">
                            <MapPinIcon className="h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-400 mt-0.5" />
                            <div className="min-w-0">
                                {social.location && (
                                    <p className="text-neutral-700 dark:text-neutral-300">{social.location}</p>
                                )}
                                {social.location_details?.map((line, i) => (
                                    <p key={i} className="text-neutral-600 dark:text-neutral-400 mt-0.5 break-words">
                                        {line}
                                    </p>
                                ))}
                                {social.location_url && (
                                    <a
                                        href={social.location_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 mt-2 text-accent font-medium hover:underline"
                                    >
                                        <MapPinSolidIcon className="h-4 w-4" />
                                        <span>{messages.profile.googleMap}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {social.email && (
                        <div className="flex gap-3">
                            <EnvelopeIcon className="h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-400 mt-0.5" />
                            <div className="min-w-0">
                                <p className="text-neutral-700 dark:text-neutral-300 break-all">{social.email}</p>
                                <a
                                    href={`mailto:${social.email}`}
                                    className="inline-flex items-center gap-1 mt-2 text-accent font-medium hover:underline"
                                >
                                    <EnvelopeSolidIcon className="h-4 w-4" />
                                    <span>{messages.profile.sendEmail}</span>
                                </a>
                            </div>
                        </div>
                    )}

                    {social.github && (
                        <div className="flex gap-3 items-center">
                            <Github className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-300" />
                            <a
                                href={social.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-accent hover:underline break-all"
                            >
                                GitHub
                            </a>
                        </div>
                    )}

                    {social.linkedin && (
                        <div className="flex gap-3 items-center">
                            <Linkedin className="h-5 w-5 shrink-0 text-[#0A66C2]" />
                            <a
                                href={encodeURI(social.linkedin)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-accent hover:underline break-all"
                            >
                                LinkedIn
                            </a>
                        </div>
                    )}

                    {extraSocialRows.map((row) => {
                        const Icon = row.icon;
                        return (
                            <div key={row.key} className="flex gap-3 items-center">
                                <Icon className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-300" />
                                <a
                                    href={row.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-accent hover:underline break-all"
                                >
                                    {row.label}
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>

            {researchInterests && researchInterests.length > 0 && (
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 mb-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <h3 className="font-semibold text-primary mb-3">{messages.profile.researchInterests}</h3>
                    <div className="flex flex-wrap gap-2">
                        {researchInterests.map((interest, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center rounded-full border border-accent/25 bg-white/80 dark:bg-neutral-900/60 px-3 py-1 text-xs font-medium text-primary shadow-sm"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {features.enable_likes && (
                <div className="flex justify-center">
                    <div className="relative">
                        <motion.button
                            onClick={handleLike}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${hasLiked
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 cursor-pointer'
                                }`}
                        >
                            {hasLiked ? (
                                <HeartSolidIcon className="h-4 w-4" />
                            ) : (
                                <HeartIcon className="h-4 w-4" />
                            )}
                            <span>{hasLiked ? messages.profile.liked : messages.profile.like}</span>
                        </motion.button>

                        <AnimatePresence>
                            {showThanks && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{ opacity: 1, y: -10, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap"
                                >
                                    {messages.profile.thanks} 😊
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-accent"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
