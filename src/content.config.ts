import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({
  label: z.string(),
  url: z.url(),
});

const cv = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cv' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    availability: z.string(),
    location: z.string(),
    email: z.email(),
    linkedin: z.url(),
    github: z.url(),
    languages: z.array(z.object({ name: z.string(), level: z.string() })),
    competencies: z.array(z.string()),
    skillGroups: z.array(z.object({ category: z.string(), skills: z.array(z.string()) })),
    experience: z.array(
      z.object({
        date: z.string(),
        title: z.string(),
        company: z.string(),
        location: z.string(),
        arrangement: z.string(),
        summary: z.string(),
        highlights: z.array(z.string()),
        links: z.array(link).default([]),
      })
    ),
    education: z.array(
      z.object({
        date: z.string(),
        title: z.string(),
        place: z.string(),
        description: z.string(),
        highlights: z.array(z.string()).default([]),
      })
    ),
  }),
});

export const collections = { cv };
