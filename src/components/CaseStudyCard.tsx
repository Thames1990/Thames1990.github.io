import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { CaseStudy } from '@/data/portfolio';

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <div className="work-case">
      <div className="work-case__summary">
        <h3 className="work-case__title">{study.title}</h3>
        <p className="work-case__eyebrow">{study.eyebrow}</p>
        <p className="work-case__context">{study.context}</p>
        {study.links.length > 0 && (
          <div className="work-case__links" aria-label={`${study.title} links`}>
            {study.links.map(({ label, url }) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                {label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="work-case__details">
        <dl aria-label="Project results" className="work-case__outcomes">
          {study.outcomes.map(({ value, label }) => (
            <div key={label} className="work-case__outcome">
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
        <Accordion type="single" collapsible className="work-case__accordion">
          <AccordionItem value="delivery">
            <AccordionTrigger>Challenge &amp; contribution</AccordionTrigger>
            <AccordionContent className="space-y-5">
              <section className="space-y-2">
                <h4 className="font-semibold">What made it tricky</h4>
                <p className="max-w-3xl leading-relaxed text-muted-foreground">{study.challenge}</p>
              </section>
              <section className="space-y-2">
                <h4 className="font-semibold">What I did</h4>
                <ul className="max-w-3xl list-disc space-y-2 pl-4 text-muted-foreground">
                  {study.contribution.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="technology">
            <AccordionTrigger>Technology &amp; tools</AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-wrap gap-2">
                {study.technologies.map((technology) => (
                  <li key={technology}><Badge variant="outline">{technology}</Badge></li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
