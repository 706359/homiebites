export default function sitemap() {
  const baseUrl = import.meta.env.VITE_SITE_URL || "https://homiebites.com";

  const routes = ["", "/menu", "/support", "/faq", "/search"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
