import { defineCollection, z } from 'astro:content';

const link = z.object({
  label: z.string(),
  url: z.string().url(),
});

const cv = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    availability: z.string(),
    location: z.string(),
    email: z.string().email(),
    linkedin: z.string().url(),
    github: z.string().url(),
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
