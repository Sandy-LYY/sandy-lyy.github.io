'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';
import { useLocaleStore } from '@/lib/stores/localeStore';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightEnglishNews(content: string): string {
    const highlights = [
        '35,934 Sephora reviews',
        'AI-assisted marketing workflow',
        'University of Bristol',
        'Shopline',
        '30% CTR',
        'Saintland Advertising',
        '50+ KOL collaborations',
        'Douyin, Bilibili, and Xiaohongshu',
    ];

    return highlights.reduce((result, phrase) => {
        const pattern = new RegExp(escapeRegExp(phrase), 'g');
        return result.replace(
            pattern,
            `<strong class="font-semibold text-primary dark:text-white">${phrase}</strong>`
        );
    }, content);
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const locale = useLocaleStore((state) => state.locale);
    const resolvedTitle = title || messages.home.news;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <span className="mt-1 w-20 flex-shrink-0 text-sm font-medium tracking-wide text-neutral-500 dark:text-neutral-400">
                            {item.date}
                        </span>
                        <p
                            className="max-w-3xl text-sm leading-7 text-neutral-700 dark:text-neutral-300"
                            dangerouslySetInnerHTML={{
                                __html: locale === 'en' ? highlightEnglishNews(item.content) : item.content,
                            }}
                        />
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
