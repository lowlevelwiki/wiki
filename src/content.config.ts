import { defineCollection } from "astro/content/config";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const wiki = defineCollection({
  loader: glob({ base: "./wiki", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { wiki };
