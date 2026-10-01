import type { APIRoute } from 'astro';
import { cv } from '@/data/cv';
import { createCvPdfBuffer } from '@/scripts/cv-pdf';

export const prerender = true;

export const GET: APIRoute = async () => {
  const pdf = await createCvPdfBuffer(cv);
  const filename = `${cv.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-cv.pdf`;

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
};
