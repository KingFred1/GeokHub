export function NewsStructuredData({ post }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "datePublished": post.publishedAt,
    "dateModified": post._updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author?.name || "GeoKhub International",
      "jobTitle": "Correspondent"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GeoKhub",
      "url": "https://www.geokhub.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.geokhub.com/logo.png"
      }
    },
    "articleSection": post.category,
    "keywords": post.tags?.join(', ') || '',
    // No geographic restrictions
    "contentLocation": null
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ 
      __html: JSON.stringify(structuredData) 
    }} />
  );
}