// Shared SEO utilities used across the application

// Extract a normalised slug string from various shapes of Sanity data.
// Slugs from the CMS can be plain strings or objects with a `current` field.
export function getSlugString(slug: any): string {
  if (!slug) return "";
  if (typeof slug === "object") {
    // some legacy documents may use `{ _type: 'slug', current: '...' }`
    return slug.current || "";
  }
  return String(slug);
}

// Determine the canonical path for a post based on its categories.
// This mirrors the logic used in the sitemap generator so that the URL
// included in the sitemap matches the canonical that appears on the page.
export function getCanonicalPath(post: any): string {
  const slugVal = getSlugString(post?.slug);
  const cats: any[] = post?.categories || [];

  for (const cat of cats) {
    const cslug = getSlugString(cat?.slug || cat?.title).toLowerCase();
    const parentSlug = getSlugString(cat?.parent?.slug || cat?.parent?.title).toLowerCase();

    // Technology sub‑categories
    if (
      [
        "ai",
        "tech-news",
        "cybersecurity",
        "programming",
        "gadgets",
        "emerging-tech",
        "cloud-devops",
      ].includes(cslug)
    ) {
      return `/technology/${cslug}/${slugVal}`;
    }

    // Lifestyle and related categories
    if (cslug === "lifestyle") {
      return `/lifestyle/${slugVal}`;
    }
    if (cslug === "mentalhealth") {
      return `/mentalhealth/${slugVal}`;
    }
    if (cslug === "wellness") {
      return `/wellness/${slugVal}`;
    }
    if (cslug === "weightloss") {
      return `/weightloss/${slugVal}`;
    }

    // News hierarchy (check child and parent slug)
    if (cslug === "world" || parentSlug === "world") {
      return `/news/world/${slugVal}`;
    }
    if (cslug === "business" || parentSlug === "business") {
      return `/news/business/${slugVal}`;
    }
    if (cslug === "news" || parentSlug === "news") {
      return `/news/${slugVal}`;
    }
  }

  // Fallback for posts without a recognised category
  return `/blogs/${slugVal}`;
}
