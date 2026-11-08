import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://weebly-gamma.vercel.app";
  const routes = [
    "",
    "/platform",
    "/how-it-works",
    "/parents",
    "/schools",
    "/schools/pilot",
    "/research",
    "/technology",
    "/trust",
    "/wellbeing",
    "/pricing",
    "/contact",
    "/faq",
    "/about",
    "/privacy",
    "/terms",
    "/child-safety",
    "/accessibility",
    "/demos",
    "/documents",
    "/creative-studio",
    "/youth/dashboard",
    "/youth/friends",
    "/youth/play",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
