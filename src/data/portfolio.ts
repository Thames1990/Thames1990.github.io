export interface CaseStudy {
  index: string;
  eyebrow: string;
  title: string;
  context: string;
  challenge: string;
  contribution: string[];
  outcomes: { value: string; label: string }[];
  technologies: string[];
  links: { label: string; href: string }[];
  tone: 'coral' | 'blue' | 'sand';
}

export const caseStudies: CaseStudy[] = [
  {
    index: '01',
    eyebrow: 'Product delivery · Audiomatik',
    title: 'Loader',
    context:
      'A cross-platform application that gives sound professionals one place to download, install, update, and restore purchases from BOOM Library and A Sound Effect.',
    challenge:
      'Replace fragmented, manual download workflows with a reliable shared platform while integrating two independent stores and guiding users away from a legacy client.',
    contribution: [
      'Owned product delivery and translated shareholder priorities into an executable roadmap.',
      'Led a distributed team of 3–5 developers across Germany and Portugal.',
      'Built the Vue and TypeScript administration portal and drove end-to-end quality.',
      'Collaborated on API, identity, database, infrastructure, and observability architecture.',
    ],
    outcomes: [
      { value: '≈10k', label: 'users reached' },
      { value: '2', label: 'partner stores integrated' },
      { value: '6 mo.', label: 'guided migration period' },
    ],
    technologies: ['Vue', 'TypeScript', 'Vuetify', 'Playwright', 'Kubernetes', 'Argo CD', 'Keycloak', 'Grafana'],
    links: [
      { label: 'Audiomatik Loader', href: 'https://audiomatik.com/loader/' },
      { label: 'A Sound Effect', href: 'https://www.asoundeffect.com/loader/' },
      { label: 'BOOM Library', href: 'https://www.boomlibrary.com/' },
    ],
    tone: 'coral',
  },
  {
    index: '02',
    eyebrow: 'Real-time aviation · datatactics',
    title: 'Fuel & Leg Twin',
    context:
      'The central operational data pipeline for Lufthansa Group airlines, consolidating heterogeneous messages across flight operations, fuel, baggage, cargo, maintenance, and navigation.',
    challenge:
      'Turn high-volume, contradictory airline data into a dependable 24/7 operational foundation while coordinating delivery across engineering, customer management, and Lufthansa Systems.',
    contribution: [
      'Acted as hands-on technical and project lead for a team of 3–5 developers.',
      'Coordinated technical teams across Lufthansa organizations and maintained a direct call-line with Lufthansa fuel managers for fast operational feedback.',
      'Developed parsers, real-time pipelines, database integrations, and React interfaces.',
      'Owned deployments, incidents, mentoring, and direct customer communication.',
    ],
    outcomes: [
      { value: '3m', label: 'Type B messages / day' },
      { value: '1m+', label: 'flights processed / year' },
      { value: '24/7', label: 'operational workload' },
    ],
    technologies: ['Groovy', 'SiddhiQL', 'Rahla', 'React', 'Mantine UI', 'Oracle', 'Kubernetes', 'Jenkins'],
    links: [
      { label: 'Aviation solutions', href: 'https://www.datatactics.de/de/categories/aviation/' },
      { label: 'OpenFlightOps', href: 'https://www.datatactics.de/de/discover/openflightops-der-stack-f%C3%BCr-den-flugbetrieb/' },
    ],
    tone: 'blue',
  },
  {
    index: '03',
    eyebrow: 'Data platform · TuneSat',
    title: '80+ TB music catalog',
    context:
      'A large-scale classification environment for music metadata, ownership rights, UCS taxonomy, and generic audio information across an extensive media catalog.',
    challenge:
      'Provision a secure, workable platform under significant time pressure so multiple engineers and external users could process and classify more than 80 TB of source material.',
    contribution: [
      'Provisioned and configured Ubuntu server infrastructure in Hetzner Cloud.',
      'Designed access controls, object-storage integration, and Bash-based DataOps workflows.',
      'Configured resilient local storage, Milvus, and supporting MySQL databases.',
      'Supported and validated the Python data-processing work delivered by the wider team.',
    ],
    outcomes: [
      { value: '80+ TB', label: 'music catalog processed' },
      { value: 'Rights + UCS', label: 'metadata domains unified' },
      { value: 'Multi-user', label: 'secure shared environment' },
    ],
    technologies: ['Ubuntu', 'Hetzner Cloud', 'Bash', 'Object Storage', 'Milvus', 'MySQL', 'Python', 'DataOps'],
    links: [],
    tone: 'sand',
  },
];
