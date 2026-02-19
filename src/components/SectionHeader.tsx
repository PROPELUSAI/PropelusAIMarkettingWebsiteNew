import AnimatedSection from './AnimatedSection';

interface SectionHeaderProps {
  tag?: string;
  title: string;
  description?: string;
  centered?: boolean;
  dark?: boolean;
}

export default function SectionHeader({ tag, title, description, centered = true, dark = false }: SectionHeaderProps) {
  return (
    <AnimatedSection className={`mb-12 lg:mb-16 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}`}>
      {tag && <span className={`tag ${dark ? 'tag-dark' : ''} mb-4 inline-flex`}>{tag}</span>}
      <h2 className="mb-4">{title}</h2>
      {description && <p className="text-lg leading-relaxed">{description}</p>}
    </AnimatedSection>
  );
}
