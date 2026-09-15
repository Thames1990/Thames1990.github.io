import { defineCollection, z } from 'astro:content';

const cv = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    location: z.string(),
    email: z.string(),
    github: z.string(),
    website: z.string(),
    focus: z.array(z.string()),
    tools: z.array(z.string()),
    experience: z.array(
      z.object({
        date: z.string(),
        title: z.string(),
        place: z.string(),
        description: z.string(),
      })
    ),
    education: z.array(
      z.object({
        date: z.string(),
        title: z.string(),
        place: z.string(),
        description: z.string(),
      })
    ),
  }),
});

export const collections = { cv };
