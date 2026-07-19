import type { MetadataRoute } from "next";
import { islands, siteUrl } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, priority: 1 },
    ...islands.map((island) => ({
      url: `${siteUrl}/${island.slug}`,
      priority: 0.8,
    })),
  ];
}
