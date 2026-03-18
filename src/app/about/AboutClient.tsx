'use client';

import Link from 'next/link';
import PageHero from '@/components/PageHero';
import AnimatedSection, { StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import CTASection from '@/components/CTASection';
import { values, siteConfig } from '@/lib/data';

export default function AboutClient() {
  return (
    <>
      <PageHero
        tag="Who We Are"
        title="About PropelusAI"
        description="AI first. Execution driven. Built for global scale."
      />

      {/* Founding Story */}
      <section className="section-padding section-light">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl font-medium mb-6">Our Story</h2>
            <p className="text-lg text-surface-600 leading-relaxed mb-6">
              PropelusAI is founded in Phoenix, Arizona, and later expanded into the Indian market, with operations in Kolkata, West Bengal, and Surat, Gujarat. It originated from a simple observation: most businesses were paying agency level prices for generic digital services that failed to deliver meaningful results.

              The founders bringing expertise in full stack engineering, AI research, and B2B marketing built PropelusAI to bridge this gap by offering deep technical capabilities and measurable outcomes, without the overhead of a traditional consultancy.  </p>
            <p className="text-surface-500 leading-relaxed mb-6">
              The initial focus was <Link href="/services/ai-based-website-building" className="text-brand-500 hover:underline">AI powered website development</Link> and <Link href="/services/ai-powered-crm-building-and-integration" className="text-brand-500 hover:underline">custom CRM systems</Link> for mid market B2B companies.
              Within the first year, the team expanded to cover <Link href="/services/saas-development" className="text-brand-500 hover:underline">SaaS development</Link>, mobile applications, LinkedIn advertising,
              <Link href="/services/marketing-automation-and-workflow-implementation" className="text-brand-500 hover:underline">marketing automation</Link>, and a full suite of <Link href="/products" className="text-brand-500 hover:underline">subscription based AI products</Link>. Today, PropelusAI operates from
              Phoenix with engineering offices in Surat and Kolkata, India, serving clients across North America, Europe,
              the Middle East, and Asia Pacific.
            </p>
            <p className="text-surface-500 leading-relaxed mb-6">
              We are also building <Link href="/soul" className="text-brand-500 hover:underline">Soul</Link>, our proprietary AI execution engine. Soul goes beyond reasoning to take autonomous
              action, handling research, outreach, scheduling, and operational tasks that currently require manual effort.
              It represents the next phase of what we believe business AI should be: not just intelligent, but operational.
            </p>
            <p className="text-surface-500 leading-relaxed">
              Every project follows the same standard: thorough discovery, transparent execution, and outcomes you can
              measure. We do not take shortcuts and we do not overpromise. We build systems that last.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* What We Build */}
      <section className="py-12 section-warm border-y border-surface-100">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl font-medium mb-6">What We Build</h2>
            <p className="text-surface-500 leading-relaxed mb-5">
              Our work spans two models. On the services side, we handle one time project builds: websites on Next.js and
              React, SaaS platforms with full backend architecture, custom CRM systems on Node.js and MongoDB, native and
              cross platform mobile apps, cybersecurity audits to NIST and SOC 2 standards, and marketing automation
              implementations using tools like HubSpot, Salesforce, and custom pipelines.
            </p>
            <p className="text-surface-500 leading-relaxed">
              On the products side, we run 21 subscription based AI systems covering <Link href="/products/ai-driven-linkedin-advertising" className="text-brand-500 hover:underline">LinkedIn advertising</Link>, content
              creation, <Link href="/products/ai-based-lead-generation-and-management" className="text-brand-500 hover:underline">lead generation</Link>, Meta and Google ads management, CRM analytics, cold calling, email marketing,
              and performance dashboards. Each product includes monthly reporting, continuous AI optimization, and a
              dedicated account manager. See what our <Link href="/testimonials" className="text-brand-500 hover:underline">clients say about working with us</Link>.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Team and Expertise */}
      <section className="section-padding section-light">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl font-medium mb-6">Our Team</h2>
            <p className="text-surface-500 leading-relaxed mb-5">
              The PropelusAI team includes full stack engineers, AI and machine learning specialists, UX designers,
              marketing strategists, and dedicated account managers. Our engineering team works primarily with TypeScript,
              <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">React</a>, <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">Next.js</a>, Node.js, Python, <a href="https://www.mongodb.com" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">MongoDB</a>, and PostgreSQL. On the infrastructure side, we deploy on AWS,
              Vercel, and Hetzner with CI/CD pipelines, automated testing, and monitoring built into every project.
            </p>
            <p className="text-surface-500 leading-relaxed">
              The US office in Phoenix handles client relationships, strategy, and project management. The India offices
              in Surat and Kolkata handle engineering, design, QA, and ongoing product operations. This structure gives
              clients US-based account management with the engineering depth and cost efficiency of a global team,
              maintaining 24/5 coverage across time zones.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="py-12 section-warm border-y border-surface-100">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl font-medium mb-6">By the Numbers</h2>
            {/* TODO: verify all numbers with leadership before launch */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { stat: '150+', label: 'Products and services delivered across 12 industries' },
                { stat: '42%', label: 'Average reduction in client sales cycle length' },
                { stat: '3.1x', label: 'Average pipeline growth for B2B clients' },
                { stat: '8', label: 'Countries served across 4 continents' },
                { stat: '24/5', label: 'Global support coverage with same-day response' },
                { stat: '4x', label: 'Average organic traffic growth for content clients' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-surface-100">
                  <div className="text-2xl font-semibold text-brand-500 shrink-0 w-16">{item.stat}</div>
                  <p className="text-sm text-surface-600">{item.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding section-dark">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-white">Mission & Vision</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <AnimatedSection delay={0.1}>
              <div className="card-dark rounded-2xl p-8 h-full">
                <h3 className="text-lg text-white mb-3">Mission</h3>
                <p className="text-surface-400 leading-relaxed">
                  To build AI powered systems that transform how businesses operate, sell, and grow. We deliver custom
                  software, marketing automation, and intelligent infrastructure with clarity, speed, and measurable results.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="card-dark rounded-2xl p-8 h-full">
                <h3 className="text-lg text-white mb-3">Vision</h3>
                <p className="text-surface-400 leading-relaxed">
                  To become the most trusted partner for AI driven digital transformation globally. We are building
                  a future where every business has access to intelligent systems that execute, not just advise.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding section-light">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <span className="tag mb-4 inline-flex">What We Stand For</span>
            <h2>Our Values</h2>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {values.map((v, i) => (
              <StaggerItem key={v.title}>
                <div className="card h-full">
                  <div className="text-sm font-mono text-brand-500 mb-3">0{i + 1}</div>
                  <h3 className="text-lg mb-2">{v.title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed">{v.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-12 section-warm border-y border-surface-100">
        <div className="container-main max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl font-medium mb-6">How We Work</h2>
            <p className="text-surface-500 leading-relaxed mb-5">
              Every engagement starts with a discovery call where we map your goals, current systems, and constraints.
              From there, we build a detailed scope document with timelines, deliverables, and milestones. No ambiguity.
              During execution, you get weekly status updates and direct access to your project lead.
            </p>
            <p className="text-surface-500 leading-relaxed">
              After launch, every service includes a post-delivery support window for bug fixes and adjustments.
              For subscription products, you receive monthly performance reports with optimization recommendations.
              We treat every client relationship as a long-term partnership, not a transaction. Read more on our <Link href="/blogs" className="text-brand-500 hover:underline">blog</Link> or check our <Link href="/faq" className="text-brand-500 hover:underline">FAQ</Link> for common questions.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Offices */}
      <section className="section-padding section-light">
        <div className="container-main">
          <AnimatedSection className="text-center mb-12">
            <h2 className="mb-3">Global Offices & Contact</h2>
            <p className="text-surface-500">We operate from the United States and India.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <AnimatedSection delay={0.1}>
              <div className="card text-center h-full">
                <h3 className="text-base font-medium mb-2">Our Locations</h3>
                <div className="mb-3">
                  <p className="text-sm font-medium text-surface-600">Phoenix, Arizona, USA</p>
                  <p className="text-sm text-surface-400">West Hide Trail, Phoenix, AZ 85085</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-600">Surat & Kolkata, India</p>
                  {/* <p className="text-sm text-surface-400">PropelusAI by RBSS Ventures</p> */}
                  <p className="text-sm text-surface-400">Gujarat & West Bengal</p>
                  <p className="text-xs text-surface-400 mt-1">GSTIN: 19ABMFR6144D1ZZ</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="card text-center h-full">
                <h3 className="text-base font-medium mb-2">Contact</h3>
                <p className="text-sm text-surface-500"><a href={`mailto:${siteConfig.email}`} className="hover:text-brand-500 transition-colors">{siteConfig.email}</a></p>
                <p className="text-sm text-surface-400 mt-1">WhatsApp IN: <br /><a href={`https://wa.me/${siteConfig.whatsapp.in.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">{siteConfig.whatsapp.in}</a></p>
                <p className="text-sm text-surface-400">WhatsApp US:  <br /><a href={`https://wa.me/${siteConfig.whatsapp.us.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-500 transition-colors">{siteConfig.whatsapp.us}</a></p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="card text-center h-full">
                <h3 className="text-base font-medium mb-2">Business Hours</h3>
                <p className="text-sm text-surface-500">9:00 AM to 12:00 AM IST</p>
                <p className="text-sm text-surface-400 mt-1">(GMT+5:30)</p>
                <p className="text-sm text-surface-400 mt-2">Monday to Friday</p>
                <p className="text-xs text-surface-400 mt-1">24/5 global support coverage</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CTASection
        tag="Ready to Build?"
        title="Ready to build the AI powered future of your business?"
        description="Whether you need a custom website, a CRM system, marketing automation, or a full digital transformation, PropelusAI will build the system that moves your business forward."
        primaryLabel="Start Your Project"
        secondaryLabel="Explore AI Products"
        secondaryHref="/products"
      />
    </>
  );
}
