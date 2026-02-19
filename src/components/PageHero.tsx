'use client';

import { motion } from 'framer-motion';

interface PageHeroProps {
  tag?: string;
  title: string;
  description?: string;
  dark?: boolean;
}

export default function PageHero({ tag, title, description, dark = false }: PageHeroProps) {
  return (
    <section className={`pt-32 pb-16 lg:pt-40 lg:pb-20 ${dark ? 'section-dark' : 'section-warm'}`}>
      <div className="container-main max-w-3xl">
        {tag && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className={`tag ${dark ? 'tag-dark' : ''} mb-5 inline-flex`}>{tag}</span>
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg leading-relaxed max-w-2xl"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
