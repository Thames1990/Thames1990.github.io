import { PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { describe, expect, it } from 'vitest';
import {
  createCvDocumentDefinition,
  createCvPdfBuffer,
  cvPdfPageMetrics,
  type CvPdfData,
} from './cv-pdf';
import { cv } from '../data/cv';

const baseCv: CvPdfData = {
  name: 'Thomas Mohr',
  title: 'Technical Project Lead / Engineering Lead',
  availability: 'Available immediately for permanent roles',
  location: 'Frankfurt am Main, Germany',
  email: 'thomas@example.com',
  linkedin: 'https://www.linkedin.com/in/example/',
  github: 'https://github.com/example',
  languages: [
    { name: 'German', level: 'Native' },
    { name: 'English', level: 'Professional working proficiency' },
  ],
  competencies: ['Technical leadership', 'Data engineering', 'Platform operations'],
  skillGroups: [
    {
      category: 'Leadership & delivery',
      skills: ['Architecture decisions', 'Mentoring', 'Stakeholder management'],
    },
  ],
  experience: [
    {
      date: '2023 – present',
      title: 'Project Owner / Software Developer',
      company: 'Example GmbH',
      location: 'Frankfurt am Main, Germany',
      arrangement: 'Hybrid',
      summary: 'Owned delivery of a cross-platform product and its supporting infrastructure.',
      highlights: ['Led a distributed engineering team.', 'Built reliable delivery workflows.'],
      links: [{ label: 'Product website', url: 'https://example.com/product' }],
    },
  ],
  education: [
    {
      date: '2013 – 2017',
      title: 'Bachelor of Science in Computer Science',
      place: 'Example University',
      description: 'Studied software engineering and distributed systems.',
      highlights: ['Thesis on distributed systems.'],
    },
  ],
  profile: ['Technical leader and hands-on engineer.', 'Experienced across product and platform delivery.'],
};

function repeatedText(label: string, count: number): string {
  return Array.from({ length: count }, (_, index) => `${label} ${index + 1}`).join(' ');
}

function loadSourceCv(): CvPdfData {
  return cv;
}

async function expectTextInsidePages(buffer: Buffer): Promise<void> {
  const document = await getDocument({ data: new Uint8Array(buffer) }).promise;
  const violations: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const textContent = await page.getTextContent();
    const textItems = textContent.items.filter((item): item is TextItem => 'str' in item && item.str.trim().length > 0);

    textItems.forEach((item) => {
      const left = item.transform[4];
      const right = left + item.width;
      const baseline = item.transform[5];

      if (left < -0.5) violations.push(`"${item.str}" starts outside page ${pageNumber}`);
      if (right > viewport.width + 0.5) violations.push(`"${item.str}" exceeds page ${pageNumber}`);
      if (baseline < -0.5) violations.push(`"${item.str}" is below page ${pageNumber}`);
      if (baseline > viewport.height + 0.5) violations.push(`"${item.str}" is above page ${pageNumber}`);
    });

    const itemsByBaseline = [...textItems].sort((first, second) => first.transform[5] - second.transform[5]);
    for (let firstIndex = 0; firstIndex < itemsByBaseline.length; firstIndex += 1) {
      const first = itemsByBaseline[firstIndex];
      const firstLeft = first.transform[4];
      const firstBaseline = first.transform[5];
      const firstRight = firstLeft + first.width;

      for (let secondIndex = firstIndex + 1; secondIndex < itemsByBaseline.length; secondIndex += 1) {
        const second = itemsByBaseline[secondIndex];
        const secondLeft = second.transform[4];
        const secondBaseline = second.transform[5];
        if (secondBaseline - firstBaseline > Math.max(first.height, second.height) + 1) break;
        const secondRight = secondLeft + second.width;
        const horizontalOverlap = Math.min(firstRight, secondRight) - Math.max(firstLeft, secondLeft);
        const verticalOverlap =
          Math.min(firstBaseline + first.height, secondBaseline + second.height) -
          Math.max(firstBaseline, secondBaseline);
        const sameBaseline = Math.abs(firstBaseline - secondBaseline) < 1.5;
        const meaningfulVerticalOverlap = verticalOverlap > Math.min(first.height, second.height) * 0.35;

        if (horizontalOverlap > 0.75 && meaningfulVerticalOverlap && !sameBaseline) {
          violations.push(`"${first.str}" overlaps "${second.str}" on page ${pageNumber}`);
        }
      }
    }
  }

  expect(violations).toEqual([]);
}

describe('createCvPdfBuffer', () => {
  it('should generate an in-bounds A4 PDF from the real CV data', async () => {
    const buffer = await createCvPdfBuffer(loadSourceCv());

    const pdf = await PDFDocument.load(buffer);
    const pages = pdf.getPages();

    expect(buffer.subarray(0, 4).toString()).toBe('%PDF');
    expect(pages.length).toBeGreaterThan(0);
    pages.forEach((page) => {
      expect(page.getWidth()).toBeCloseTo(cvPdfPageMetrics.width, 1);
      expect(page.getHeight()).toBeCloseTo(cvPdfPageMetrics.height, 1);
    });
    await expectTextInsidePages(buffer);
  });

  it('should paginate oversized and expanded CV data without changing page geometry', async () => {
    const oversizedCv: CvPdfData = {
      ...baseCv,
      name: repeatedText('Long candidate name', 8),
      title: repeatedText('Technical leadership title', 16),
      availability: repeatedText('Availability information', 18),
      location: repeatedText('Long location', 18),
      email: `${'long-address-'.repeat(10)}candidate@example.com`,
      competencies: Array.from({ length: 40 }, (_, index) => repeatedText(`Competency ${index + 1}`, 12)),
      profile: Array.from({ length: 12 }, (_, index) => repeatedText(`Profile paragraph ${index + 1}`, 80)),
      experience: Array.from({ length: 8 }, (_, index) => ({
        ...baseCv.experience[0],
        date: repeatedText(`Date ${index + 1}`, 8),
        title: repeatedText(`Role title ${index + 1}`, 20),
        company: repeatedText(`Company ${index + 1}`, 12),
        location: repeatedText(`Location ${index + 1}`, 15),
        arrangement: repeatedText('Working arrangement', 12),
        summary: repeatedText(`Summary ${index + 1}`, 120),
        highlights: Array.from({ length: 14 }, (_, itemIndex) =>
          repeatedText(`Achievement ${index + 1}.${itemIndex + 1}`, 55)
        ),
        links: Array.from({ length: 12 }, (_, linkIndex) => ({
          label: repeatedText(`Project ${linkIndex + 1}`, 8),
          url: `https://example.com/projects/${index}/${linkIndex}`,
        })),
      })),
      education: Array.from({ length: 5 }, (_, index) => ({
        ...baseCv.education[0],
        title: repeatedText(`Education title ${index + 1}`, 20),
        place: repeatedText(`Education place ${index + 1}`, 15),
        description: repeatedText(`Education description ${index + 1}`, 90),
        highlights: [repeatedText('Education highlight', 60)],
      })),
      skillGroups: Array.from({ length: 10 }, (_, index) => ({
        category: repeatedText(`Skill category ${index + 1}`, 8),
        skills: Array.from({ length: 30 }, (_, skillIndex) => repeatedText(`Skill ${skillIndex + 1}`, 5)),
      })),
      languages: Array.from({ length: 12 }, (_, index) => ({
        name: repeatedText(`Language ${index + 1}`, 5),
        level: repeatedText('Proficiency level', 10),
      })),
    };

    const buffer = await createCvPdfBuffer(oversizedCv);
    const pdf = await PDFDocument.load(buffer);

    expect(pdf.getPageCount()).toBeGreaterThan(10);
    pdf.getPages().forEach((page) => {
      expect(page.getWidth()).toBeCloseTo(cvPdfPageMetrics.width, 1);
      expect(page.getHeight()).toBeCloseTo(cvPdfPageMetrics.height, 1);
    });
    await expectTextInsidePages(buffer);
  }, 30_000);
});

describe('createCvDocumentDefinition', () => {
  it('should use flowing content rather than fixed text coordinates', () => {
    const definition = createCvDocumentDefinition(baseCv);
    const serializedContent = JSON.stringify(definition.content);

    expect(serializedContent).not.toContain('absolutePosition');
    expect(serializedContent).not.toContain('relativePosition');
    expect(serializedContent).not.toContain('noWrap');
  });
});
