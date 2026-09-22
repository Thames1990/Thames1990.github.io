import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type {
  Content,
  ContentStack,
  ContentTable,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';

interface CvLink {
  label: string;
  url: string;
}

interface CvRole {
  date: string;
  title: string;
  company: string;
  location: string;
  arrangement: string;
  summary: string;
  highlights: string[];
  links: CvLink[];
}

interface CvEducation {
  date: string;
  title: string;
  place: string;
  description: string;
  highlights: string[];
}

export interface CvPdfData {
  name: string;
  title: string;
  availability: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  languages: Array<{ name: string; level: string }>;
  competencies: string[];
  skillGroups: Array<{ category: string; skills: string[] }>;
  experience: CvRole[];
  education: CvEducation[];
  profile: string[];
}

const COLORS = {
  ink: '#14120f',
  muted: '#645849',
  accent: '#d63421',
  line: '#d2be9e',
  paper: '#faf7ee',
  white: '#ffffff',
} as const;

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const PAGE_MARGIN = 42;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;

pdfMake.vfs = pdfFonts;

const styles: StyleDictionary = {
  name: {
    fontSize: 27,
    bold: true,
    color: COLORS.ink,
    lineHeight: 1.05,
    margin: [0, 0, 0, 5],
  },
  title: {
    fontSize: 11,
    color: COLORS.muted,
    lineHeight: 1.25,
    margin: [0, 0, 0, 16],
  },
  section: {
    fontSize: 8,
    bold: true,
    color: COLORS.ink,
    characterSpacing: 0.7,
    margin: [0, 0, 0, 9],
  },
  roleTitle: {
    fontSize: 14,
    bold: true,
    color: COLORS.ink,
    lineHeight: 1.12,
    margin: [0, 0, 0, 3],
  },
  organization: {
    fontSize: 8.5,
    bold: true,
    color: COLORS.ink,
    lineHeight: 1.2,
    margin: [0, 0, 0, 3],
  },
  date: {
    fontSize: 7,
    bold: true,
    color: COLORS.accent,
    characterSpacing: 0.3,
    lineHeight: 1.2,
  },
  metadata: {
    fontSize: 7,
    color: COLORS.muted,
    lineHeight: 1.25,
  },
  body: {
    fontSize: 9,
    color: COLORS.muted,
    lineHeight: 1.35,
  },
  bodyStrong: {
    fontSize: 9,
    color: COLORS.ink,
    lineHeight: 1.35,
  },
  link: {
    fontSize: 7,
    bold: true,
    color: COLORS.accent,
    decoration: 'underline',
  },
};

function sectionHeading(label: string): ContentTable {
  return {
    table: {
      widths: ['*'],
      body: [[{ text: label.toUpperCase(), style: 'section' }]],
    },
    layout: {
      hLineColor: () => COLORS.line,
      hLineWidth: (index: number) => (index === 0 ? 0.7 : 0),
      vLineWidth: () => 0,
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 12,
      paddingBottom: () => 0,
    },
    margin: [0, 8, 0, 0],
  };
}

function contactPanel(cv: CvPdfData): ContentTable {
  return {
    table: {
      widths: ['*', '*'],
      body: [
        [
          { text: cv.availability, bold: true, color: COLORS.white, lineHeight: 1.25 },
          { text: cv.email, link: `mailto:${cv.email}`, color: COLORS.white, lineHeight: 1.25 },
        ],
        [
          { text: cv.location, color: COLORS.white, lineHeight: 1.25 },
          {
            text: [
              { text: 'LinkedIn', link: cv.linkedin, decoration: 'underline' },
              { text: '    ' },
              { text: 'GitHub', link: cv.github, decoration: 'underline' },
            ],
            color: COLORS.white,
            lineHeight: 1.25,
          },
        ],
      ],
    },
    layout: {
      fillColor: () => COLORS.ink,
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingLeft: () => 13,
      paddingRight: () => 13,
      paddingTop: () => 8,
      paddingBottom: () => 8,
    },
    margin: [0, 0, 0, 14],
  };
}

function roleContent(role: CvRole): ContentStack {
  const links: Content =
    role.links.length === 0
      ? []
      : {
          text: role.links.flatMap((link, index) => [
            ...(index === 0 ? [] : [{ text: '   ·   ', color: COLORS.line }]),
            { text: link.label, link: link.url, style: 'link' },
          ]),
          margin: [0, 5, 0, 0],
        };

  return {
    stack: [
      {
        table: {
          widths: [90, '*'],
          body: [
            [
              { text: role.date.toUpperCase(), style: 'date' },
              {
                stack: [
                  { text: role.title, style: 'roleTitle' },
                  { text: role.company, style: 'organization' },
                  { text: `${role.location} · ${role.arrangement}`, style: 'metadata' },
                ],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
        },
        margin: [0, 0, 0, 9],
      },
      { text: role.summary, style: 'bodyStrong', margin: [0, 0, 0, 7] },
      {
        ul: role.highlights.map((highlight) => ({ text: highlight, style: 'body' })),
        markerColor: COLORS.accent,
        type: 'square',
        margin: [5, 0, 0, 0],
      },
      links,
    ],
    margin: [0, 0, 0, 17],
  };
}

function educationContent(entry: CvEducation): ContentStack {
  return {
    stack: [
      {
        table: {
          widths: [90, '*'],
          body: [
            [
              { text: entry.date.toUpperCase(), style: 'date' },
              {
                stack: [
                  { text: entry.title, style: 'roleTitle' },
                  { text: entry.place, style: 'organization' },
                ],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 0,
          paddingRight: () => 0,
          paddingTop: () => 0,
          paddingBottom: () => 0,
        },
        margin: [0, 0, 0, 7],
      },
      { text: entry.description, style: 'body', margin: [0, 0, 0, 5] },
      ...(entry.highlights.length > 0
        ? [
            {
              ul: entry.highlights.map((highlight) => ({ text: highlight, style: 'body' })),
              markerColor: COLORS.accent,
              type: 'square' as const,
              margin: [5, 0, 0, 0] as [number, number, number, number],
            },
          ]
        : []),
    ],
    margin: [0, 0, 0, 15],
  };
}

function skillGroupContent(group: CvPdfData['skillGroups'][number]): ContentTable {
  return {
    table: {
      widths: [105, '*'],
      body: [
        [
          { text: group.category.toUpperCase(), style: 'date' },
          { text: group.skills.join('  ·  '), style: 'body' },
        ],
      ],
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 0,
      paddingBottom: () => 7,
    },
  };
}

export function createCvDocumentDefinition(cv: CvPdfData): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [PAGE_MARGIN, PAGE_MARGIN, PAGE_MARGIN, 48],
    background: {
      canvas: [
        { type: 'rect', x: 0, y: 0, w: PAGE_WIDTH, h: PAGE_HEIGHT, color: COLORS.paper },
        { type: 'rect', x: 0, y: 0, w: 10, h: PAGE_HEIGHT, color: COLORS.accent },
      ],
    },
    header: (currentPage: number) =>
      currentPage === 1
        ? []
        : {
            text: `${cv.name.toUpperCase()}  /  CURRICULUM VITAE`,
            style: 'date',
            margin: [PAGE_MARGIN, 22, PAGE_MARGIN, 0],
          },
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        { text: `${cv.name}  ·  Curriculum Vitae`, alignment: 'left' },
        { text: `${currentPage} / ${pageCount}`, alignment: 'right' },
      ],
      color: COLORS.muted,
      fontSize: 7,
      margin: [PAGE_MARGIN, 10, PAGE_MARGIN, 0],
    }),
    info: {
      title: `${cv.name} — Curriculum Vitae`,
      subject: `${cv.title} curriculum vitae`,
      author: cv.name,
      creator: `${cv.name} portfolio`,
      keywords: 'curriculum vitae, CV, engineering lead, technical project lead',
    },
    defaultStyle: {
      font: 'Roboto',
      fontSize: 9,
      color: COLORS.muted,
    },
    styles,
    content: [
      { text: 'CURRICULUM VITAE', style: 'date', margin: [0, 0, 0, 9] },
      { text: cv.name, style: 'name' },
      { text: cv.title, style: 'title' },
      contactPanel(cv),
      sectionHeading('Profile'),
      ...cv.profile.map((paragraph, index) => ({
        text: paragraph,
        style: index === 0 ? 'bodyStrong' : 'body',
        margin: [0, 0, 0, 7] as [number, number, number, number],
      })),
      sectionHeading('Core strengths'),
      {
        ul: cv.competencies.map((competency) => ({ text: competency, style: 'body' })),
        markerColor: COLORS.accent,
        type: 'square',
        margin: [5, 0, 0, 3],
      },
      sectionHeading('Experience'),
      ...cv.experience.map(roleContent),
      sectionHeading('Education'),
      ...cv.education.map(educationContent),
      sectionHeading('Skills & tools'),
      ...cv.skillGroups.map(skillGroupContent),
      sectionHeading('Languages'),
      {
        text: cv.languages.flatMap((language, index) => [
          ...(index === 0 ? [] : [{ text: '    ·    ', color: COLORS.line }]),
          { text: language.name, bold: true, color: COLORS.ink },
          { text: ` — ${language.level}` },
        ]),
        style: 'body',
      },
    ],
  };
}

export async function createCvPdfBuffer(cv: CvPdfData): Promise<Buffer> {
  const document = pdfMake.createPdf(createCvDocumentDefinition(cv));

  return new Promise<Buffer>((resolve, reject) => {
    try {
      document.getBuffer((buffer) => resolve(Buffer.from(buffer)));
    } catch (error: unknown) {
      reject(error);
    }
  });
}

export async function downloadCvPdf(cv: CvPdfData): Promise<void> {
  const filename = `${cv.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-cv.pdf`;
  const document = pdfMake.createPdf(createCvDocumentDefinition(cv));

  await new Promise<void>((resolve, reject) => {
    try {
      document.download(filename, resolve);
    } catch (error: unknown) {
      reject(error);
    }
  });
}

export const cvPdfPageMetrics = {
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT,
  contentWidth: CONTENT_WIDTH,
} as const;
