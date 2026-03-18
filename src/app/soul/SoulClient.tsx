'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CTASection from '@/components/CTASection';
import { useJoinSoulWaitlistMutation } from '@/store/api/soulApi';
import FormSelect, { SelectOption } from '@/components/ui/FormSelect';
import FormField from '@/components/ui/FormField';

const industries = [
  'Technology / SaaS',
  'E-Commerce / Retail',
  'Healthcare',
  'Financial Services',
  'Manufacturing',
  'Education',
  'Real Estate',
  'Consulting / Agency',
  'Logistics / Supply Chain',
  'Media / Entertainment',
  'Other',
];

const capabilities = [
  {
    title: 'Autonomous Workflow Execution',
    description:
      'Give Soul a goal, not instructions. It breaks down complex objectives into multi-step workflows and executes them end to end, from lead capture to CRM update to follow up email, without you touching a button.',
  },
  {
    title: 'Brand Voice DNA',
    description:
      'Soul extracts your brand\'s voice from existing content, customer interactions, and your website. Every piece of content it creates, every reply it sends, sounds exactly like your team wrote it. Not generic AI output.',
  },
  {
    title: 'Self Directed Market Research',
    description:
      'Soul scans your market daily. It tracks competitors, identifies prospect signals, monitors industry trends, and gathers intelligence from public sources, then turns that research into actionable execution plans.',
  },
  {
    title: 'Intelligent Lead Qualification',
    description:
      'Soul monitors social conversations, website activity, and inbound inquiries. It identifies buying signals, scores prospects against your ICP, asks qualifying questions, and routes hot leads to your team in real time.',
  },
  {
    title: 'Cross Channel Orchestration',
    description:
      'One AI brain connected to every channel. CRM, email, social media, ads, analytics, and calendar. Soul coordinates actions across all of them, ensuring every touchpoint is consistent, timely, and data driven.',
  },
  {
    title: 'Predictive Decision Making',
    description:
      'Soul analyzes patterns across your pipeline, content performance, and customer behavior. It doesn\'t just tell you what\'s working. It identifies the highest impact next action and executes it before you ask.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Connect Your Stack',
    desc: 'Link your CRM, email, social accounts, and analytics tools in minutes. Soul supports 25+ platforms. One click OAuth. No code required.',
  },
  {
    step: '02',
    title: 'Soul Learns Your Business',
    desc: 'Soul analyzes your existing content, customer data, brand voice, competitors, and market position. It builds a deep understanding of your goals, audience, and growth objectives, and keeps learning with every interaction.',
  },
  {
    step: '03',
    title: 'Strategic Planning',
    desc: 'Using your business context and real time market data, Soul formulates weekly execution plans. It prioritizes actions by impact, maps workflows across channels, and identifies opportunities your team would miss.',
  },
  {
    step: '04',
    title: 'Autonomous Execution',
    desc: 'Soul acts. It generates brand consistent content, schedules posts at optimal times, qualifies inbound leads, sends personalized outreach, updates your CRM, monitors brand mentions, and escalates only what requires human judgment.',
  },
];

const replacements = [
  { category: 'Social media scheduler', cost: '$99/mo', soul: 'Publishes, schedules, and optimizes across 8+ platforms' },
  { category: 'CRM platform', cost: '$45-300/mo', soul: 'CRM with AI powered lead scoring and pipeline management' },
  { category: 'Content creation tool', cost: '$13-2,000/mo', soul: 'AI content generation in your brand voice including text, image, and video' },
  { category: 'Social listening tool', cost: '$249/mo', soul: 'Unified inbox, sentiment analysis, auto replies' },
  { category: 'SEO intelligence platform', cost: '$130/mo', soul: 'SEO intelligence, keyword tracking, content gap analysis' },
  { category: 'Workflow automation tool', cost: '$20-100/mo', soul: 'Built in workflow orchestration, no separate automation tool needed' },
  { category: 'Bio link tool', cost: '$5/mo', soul: 'Bio link pages included' },
];

const agents = [
  {
    name: 'Content Strategist',
    desc: 'Analyzes trending topics, competitor content, and your audience data to generate weekly content calendars. Every idea is backed by data, not guesswork.',
  },
  {
    name: 'Content Creator',
    desc: 'Generates platform specific posts using your Brand Voice DNA. Four section storytelling format with Hook, Story, Lesson, and Call to Action, optimized for each platform\'s algorithm.',
  },
  {
    name: 'Publisher and Scheduler',
    desc: 'Handles cross posting, optimal timing, retry logic on failures, and queue management. Posts go out at the exact time your audience is most active.',
  },
  {
    name: 'Community Manager',
    desc: 'Monitors every DM, comment, and mention across all platforms from a unified inbox. Auto replies to common questions. Escalates negative sentiment to your team.',
  },
  {
    name: 'Analytics and Insights',
    desc: 'Detects performance patterns, anomalies, and trends. Generates automated weekly reports. Tells you what is working, what is not, and what to do about it.',
  },
  {
    name: 'Reputation and Crisis Detection',
    desc: 'Monitors brand mentions, sentiment shifts, and potential PR issues in real time. Activates crisis protocols automatically by pausing scheduled content, alerting your team, and drafting response strategies.',
  },
  {
    name: 'Growth and Engagement',
    desc: 'Identifies growth opportunities, suggests influencer partnerships, and optimizes engagement strategies based on your data and industry benchmarks.',
  },
  {
    name: 'Orchestrator',
    desc: 'The meta-agent that coordinates all other agents. Resolves conflicts, prioritizes tasks, monitors system health, and ensures every agent\'s output is consistent with your business goals.',
  },
];

const securityFeatures = [
  'AES-256-GCM encryption for all stored credentials and tokens',
  'Self hosted AI where your data never reaches external AI providers',
  'Multi-tenant isolation with Row-Level Security',
  'Token family rotation with automatic theft detection',
  'Append-only audit logging with hash-chain integrity verification',
  'GDPR and SOC2-ready architecture from day one',
];

const platforms = [
  'Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok', 'X (Twitter)',
  'Google Business Profile', 'WhatsApp Business', 'Pinterest', 'Reddit',
  'Telegram', 'Discord', 'Threads', 'Medium', 'WordPress', 'Snapchat',
  'Bluesky', 'Mastodon', 'Quora', 'Twitch', 'Vimeo', 'ShareChat', 'Moj',
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

const industryOptions: SelectOption[] = industries.map((ind) => ({ value: ind, label: ind }));

export default function SoulClient() {
  const [joinWaitlist, { isLoading, isSuccess, isError, error }] =
    useJoinSoulWaitlistMutation();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile_number: '',
    purpose: '',
    industry: '',
    current_tools: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearErr = (field: string) => {
    if (fieldErrors[field]) setFieldErrors((p) => { const { [field]: _, ...rest } = p; return rest; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Please enter your full name';
    if (!form.email.trim()) errs.email = 'Please enter your email address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await joinWaitlist(form).unwrap();
      setForm({ name: '', email: '', mobile_number: '', purpose: '', industry: '', current_tools: '' });
    } catch {
      // error state handled by RTK Query
    }
  };

  const serverError =
    isError && error && 'data' in error
      ? (error.data as { error?: string })?.error
      : 'Something went wrong. Please try again.';

  return (
    <main className="bg-surface-950 text-white min-h-screen">
      {/* ── SECTION 1: Hero ── */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px]" />
        </div>

        <div className="container-main relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp}>
            <span className="inline-block px-4 py-1.5 text-caption font-medium tracking-widest uppercase text-brand-400 border border-brand-400/20 rounded-full mb-6">
              Coming Soon
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-display-lg lg:text-[4.5rem] leading-[1.05] font-bold tracking-tight mb-6"
          >
            Your AI Execution Engine for{' '}
            <span className="bg-gradient-to-r from-brand-400 to-brand-secondary bg-clip-text text-transparent">
              Sales, Marketing, and Operations
            </span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-body-lg text-neutral-400 max-w-2xl mx-auto mb-4"
          >
            Soul does not suggest. It executes. It connects to your CRM, email, ads, and analytics, then autonomously runs campaigns, qualifies leads, and orchestrates multi step workflows. Built by PropelusAI.
          </motion.p>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body-sm text-neutral-500 max-w-xl mx-auto mb-10"
          >
            Self-hosted AI. Your data never leaves your servers. No cloud lock-in.
          </motion.p>

          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.25 }}>
            <a
              href="#waitlist"
              className="inline-flex items-center px-8 py-3.5 text-body-md font-semibold rounded-radius-lg bg-brand-primary hover:bg-brand-accent text-white transition-colors duration-normal"
            >
              Join the Waitlist
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: Positioning Statement ── */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="container-main px-4 max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <span className="text-caption font-medium tracking-widest uppercase text-brand-400 mb-3 block">
              Beyond Suggestions
            </span>
            <h2 className="text-display-sm font-bold mb-6">
              Most AI tools think. Soul executes.
            </h2>
            <p className="text-body-lg text-neutral-400 leading-relaxed">
              Every AI tool on the market stops at &quot;here is what you should do.&quot; Soul goes further. It understands your business context, makes informed decisions, and carries them out across sales, marketing, and operations without waiting for your approval on every step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 3: Core Capabilities ── */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="container-main px-4">
          <motion.div {...fadeUp} className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-caption font-medium tracking-widest uppercase text-brand-400 mb-3 block">
              Core Capabilities
            </span>
            <h2 className="text-display-sm font-bold">
              One engine. Six superpowers.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-radius-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-primary/30 transition-colors duration-normal"
              >
                <h3 className="text-heading-3 font-semibold mb-2">{cap.title}</h3>
                <p className="text-body-sm text-neutral-400">{cap.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: How It Works ── */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="container-main px-4 max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-caption font-medium tracking-widest uppercase text-brand-400 mb-3 block">
              How It Works
            </span>
            <h2 className="text-display-sm font-bold">
              Four steps. Zero babysitting.
            </h2>
          </motion.div>

          <div className="space-y-8">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="shrink-0 w-14 h-14 rounded-radius-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-400 font-bold text-body-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-heading-3 font-semibold mb-1">{item.title}</h3>
                  <p className="text-body-md text-neutral-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: What Soul Replaces ── */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="container-main px-4 max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-6 max-w-3xl mx-auto">
            <span className="text-caption font-medium tracking-widest uppercase text-brand-400 mb-3 block">
              One Platform, Not Seven
            </span>
            <h2 className="text-display-sm font-bold mb-4">
              Stop paying $500/month for tools that don&apos;t talk to each other.
            </h2>
            <p className="text-body-md text-neutral-400 mb-12">
              Most businesses cobble together 5-7 separate tools for social media, CRM, content creation, analytics, email, SEO, and automation. They still end up doing the work manually. Soul replaces the stack and the manual work.
            </p>
          </motion.div>

          {/* <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-x-auto"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.1]">
                  <th className="py-4 px-4 text-body-sm font-semibold text-neutral-300">What you use today</th>
                  <th className="py-4 px-4 text-body-sm font-semibold text-neutral-300">Monthly cost</th>
                  <th className="py-4 px-4 text-body-sm font-semibold text-brand-400">What Soul does instead</th>
                </tr>
              </thead>
              <tbody>
                {replacements.map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.06]">
                    <td className="py-3 px-4 text-body-sm text-neutral-400">{row.category}</td>
                    <td className="py-3 px-4 text-body-sm text-neutral-500">{row.cost}</td>
                    <td className="py-3 px-4 text-body-sm text-neutral-300">{row.soul}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-brand-primary/30">
                  <td className="py-4 px-4 text-body-sm font-semibold text-white">Total</td>
                  <td className="py-4 px-4 text-body-sm font-semibold text-neutral-400">$561-2,873/mo</td>
                  <td className="py-4 px-4 text-body-sm font-semibold text-brand-400">Soul starts at $499/mo</td>
                </tr>
              </tbody>
            </table>
          </motion.div> */}
        </div>
      </section>

      {/* ── SECTION 6: The PROPELUS Engine ── */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="container-main px-4">
          <motion.div {...fadeUp} className="text-center mb-6 max-w-3xl mx-auto">
            <span className="text-caption font-medium tracking-widest uppercase text-brand-400 mb-3 block">
              Under The Hood
            </span>
            <h2 className="text-display-sm font-bold mb-4">
              Meet PROPELUS, the AI engine that powers Soul.
            </h2>
            <p className="text-body-md text-neutral-400 mb-12">
              PROPELUS is a purpose-built AI system with 8 specialized agents, each trained for a specific business function. They coordinate, share context, and execute together like a team, not a tool.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="p-6 rounded-radius-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-primary/30 transition-colors duration-normal"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-radius-md bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-400 font-bold text-body-sm">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-heading-4 font-semibold">{agent.name}</h3>
                </div>
                <p className="text-body-sm text-neutral-400">{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: Security and Data Sovereignty ── */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="container-main px-4 max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-caption font-medium tracking-widest uppercase text-brand-400 mb-3 block">
              Your Data. Your Servers.
            </span>
            <h2 className="text-display-sm font-bold mb-4">
              Self-hosted AI. Bank-level security. Complete data sovereignty.
            </h2>
            <p className="text-body-md text-neutral-400 max-w-2xl mx-auto">
              Unlike every other AI platform, Soul runs on your own infrastructure. Your business data, customer information, and brand intelligence never leave your servers. No third-party AI training on your data. No cloud vendor lock-in.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto"
          >
            {securityFeatures.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-radius-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="w-5 h-5 rounded-full bg-status-success/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-body-sm text-neutral-300">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 8: Platforms Supported ── */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="container-main px-4 max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <span className="text-caption font-medium tracking-widest uppercase text-brand-400 mb-3 block">
              Connected Everywhere
            </span>
            <h2 className="text-display-sm font-bold mb-4">
              25+ platforms. One command center.
            </h2>
            <p className="text-body-md text-neutral-400 max-w-2xl mx-auto mb-12">
              Connect every platform your audience uses. Soul handles the API differences, character limits, media formats, and posting rules so your content is optimized for each platform automatically.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {platforms.map((platform) => (
              <span
                key={platform}
                className="px-4 py-2 text-body-sm text-neutral-300 bg-white/[0.04] border border-white/[0.08] rounded-radius-lg hover:border-brand-primary/30 transition-colors duration-normal"
              >
                {platform}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 10: Waitlist Form ── */}
      <section id="waitlist" className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="container-main px-4 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left */}
            <motion.div {...fadeUp}>
              <span className="text-caption font-medium tracking-widest uppercase text-brand-400 mb-3 block">
                Early Access
              </span>
              <h2 className="text-display-sm font-bold mb-4">
                Be the first team to deploy Soul.
              </h2>
              <p className="text-body-md text-neutral-400 mb-8">
                We are building Soul for businesses that are done with AI that only suggests. If you want an AI that actually executes, join the waitlist. Limited to the first 200 teams.
              </p>

              <div className="space-y-4">
                {[
                  'Early access before public launch',
                  'Dedicated onboarding with the founding team',
                  'Direct input into the product roadmap',
                  'Priority integration support',
                  'Locked-in early adopter pricing',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0 text-brand-400">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-body-sm text-neutral-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {isSuccess ? (
                <div className="p-8 rounded-radius-xl bg-white/[0.03] border border-status-success/30 text-center">
                  <div className="w-14 h-14 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-4 text-status-success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-heading-2 font-semibold mb-2">You are on the list</h3>
                  <p className="text-body-md text-neutral-400">
                    We will notify you when Soul is ready for early access. Keep an eye on your inbox.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-8 rounded-radius-xl bg-white/[0.03] border border-white/[0.06] space-y-5"
                >
                  <h3 className="text-heading-2 font-semibold mb-1">Join the Waitlist</h3>
                  <p className="text-body-sm text-neutral-500 mb-4">
                    Register now to get early access when we launch.
                  </p>

                  {isError && (
                    <div className="p-3 rounded-radius-md bg-status-error/10 border border-status-error/20 text-body-sm text-status-error">
                      {serverError}
                    </div>
                  )}

                  <FormField label="Full Name" required error={fieldErrors.name} isDark>
                    <input name="name" type="text" value={form.name} onChange={(e) => { handleChange(e); clearErr('name'); }} placeholder="Your full name"
                      className={`w-full px-4 py-3 rounded-radius-md bg-white/[0.05] border ${fieldErrors.name ? 'border-red-400' : 'border-white/[0.1]'} text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-primary/50 transition-colors text-body-sm`} />
                  </FormField>

                  <FormField label="Email" required error={fieldErrors.email} isDark>
                    <input name="email" type="email" value={form.email} onChange={(e) => { handleChange(e); clearErr('email'); }} placeholder="you@company.com"
                      className={`w-full px-4 py-3 rounded-radius-md bg-white/[0.05] border ${fieldErrors.email ? 'border-red-400' : 'border-white/[0.1]'} text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-primary/50 transition-colors text-body-sm`} />
                  </FormField>

                  <FormField label="Mobile Number" isDark>
                    <input name="mobile_number" type="tel" value={form.mobile_number} onChange={handleChange} placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-radius-md bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-primary/50 transition-colors text-body-sm" />
                  </FormField>

                  <FormField label="Industry" isDark>
                    <FormSelect options={industryOptions} value={form.industry} onChange={(v) => setForm((p) => ({ ...p, industry: v }))} placeholder="Select your industry" isDark />
                  </FormField>

                  <FormField label="What would you use Soul for?" isDark>
                    <textarea name="purpose" rows={3} value={form.purpose} onChange={handleChange} placeholder="e.g. Automate lead qualification and outreach"
                      className="w-full px-4 py-3 rounded-radius-md bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-primary/50 transition-colors text-body-sm resize-none" />
                  </FormField>

                  <FormField label="What tools are you currently using?" isDark>
                    <input name="current_tools" type="text" value={form.current_tools} onChange={handleChange} placeholder="e.g. CRM, social scheduler, email marketing"
                      className="w-full px-4 py-3 rounded-radius-md bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-primary/50 transition-colors text-body-sm" />
                  </FormField>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-radius-md bg-brand-primary hover:bg-brand-accent text-white font-semibold text-body-md transition-colors duration-normal disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Submitting...' : 'Get Early Access'}
                  </button>

                  <p className="text-caption text-neutral-600 text-center">
                    By registering, you agree to our{' '}
                    <Link href="/privacy" className="text-brand-400 hover:underline">
                      privacy policy
                    </Link>
                    . No spam, ever.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SECTION 11: Final CTA ── */}
      <CTASection
        tag="The Future is Execution"
        title="The market does not reward the best ideas. It rewards the best execution."
        description="Every business has a strategy. Most lack the capacity to execute it consistently across channels, time zones, and platforms. Soul closes that gap, autonomously, 24/7, at a fraction of the cost of a marketing team."
        primaryLabel="Get Early Access"
        primaryHref="#waitlist"
        secondaryLabel="Talk to the Founders"
        secondaryHref="/contact"
      />
    </main>
  );
}
