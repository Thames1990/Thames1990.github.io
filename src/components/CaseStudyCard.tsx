import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { CaseStudy } from '@/data/portfolio';

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <Card className="gap-0 pt-0">
      <CardHeader className="gap-3 border-b bg-secondary pt-(--card-spacing)">
        <CardTitle><h3 className="text-2xl md:text-3xl">{study.title}</h3></CardTitle>
        <CardDescription>{study.eyebrow}</CardDescription>
        <p className="max-w-3xl leading-relaxed">{study.context}</p>
      </CardHeader>
      <CardContent className="py-6">
        <dl aria-label="Project results" className="grid grid-cols-3 gap-3 divide-x sm:gap-5">
          {study.outcomes.map(({ value, label }) => (
            <div key={label} className="min-w-0 pl-3 first:pl-0 sm:pl-5">
              <dt className="break-words text-xl font-semibold tracking-tight text-primary sm:text-3xl">{value}</dt>
              <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</dd>
            </div>
          ))}
        </dl>
        <Accordion type="single" collapsible className="mt-6 border-t">
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
      </CardContent>
      {study.links.length > 0 && (
        <CardFooter className="flex-wrap gap-2">
          {study.links.map(({ label, url }) => (
            <a key={url} className={buttonVariants({ variant: 'outline', size: 'sm' })} href={url} target="_blank" rel="noopener noreferrer">
              {label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </CardFooter>
      )}
    </Card>
  );
}
