import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FieldNotes() {
  return (
    <Card className="bg-secondary">
      <CardHeader>
        <CardTitle><h2>Field notes</h2></CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-6">
          <div>
            <dt className="text-3xl font-semibold"><span data-count-to="8" data-count-suffix="+ years">8+ years</span></dt>
            <dd className="text-muted-foreground">Engineering experience</dd>
          </div>
          <div>
            <dt className="text-3xl font-semibold"><span data-count-to="5" data-count-suffix="+">5+</span></dt>
            <dd className="text-muted-foreground">Developers per project</dd>
          </div>
          <div>
            <dt className="text-3xl font-semibold">Code + people</dt>
            <dd className="text-muted-foreground">Where I do my best work</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
