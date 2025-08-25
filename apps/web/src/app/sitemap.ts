import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://loopearn.com",
      lastModified: new Date(),
    },
    {
      url: "https://loopearn.com/blog",
      lastModified: new Date(),
    },
    {
      url: "https://loopearn.com/blog/introducing-loopearn",
      lastModified: new Date(),
    },
  ];
}
