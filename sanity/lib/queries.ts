import { defineQuery } from "next-sanity";

// desc)[0..4] {
export const RELATED_POSTS_QUERY = `
  *[_type == "post" && references(*[_type=="category" && _id == $categoryId]._id) && slug.current != $slug] | order(publishedAt desc)[0..1000] {
    _id,
    title,
    slug,
    publishedAt,
    _createdAt,
    _updatedAt,
    author -> {
      _id, name, image, bio
    },
    views,
    excerpt,
    mainImage {
      asset->{
        _id,
        url
      }
    },
    // Include categories so callers can determine correct detail URL
    categories[]->{
      title,
      slug,
      parent->{
        title,
        slug
      }
    }
  }
`;

// In your sanity/lib/queries.ts
export const SEARCH_QUERY = `*[_type == "post" && (
  title match $searchTerm || 
  body[].children[].text match $searchTerm ||
  author->name match $searchTerm
)] {
  _id,
  title,
  slug,
  publishedAt,
  _createdAt,
  _updatedAt,
  author -> {
    _id, name, image, bio
  },
  views,
  description,
  category,
  mainImage {
    asset -> {
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  image {
    asset -> {
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  }
}`;

// Update in @/sanity/lib/queries.ts
export const BLOG_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    _createdAt,
    _updatedAt,
    author -> {
      name, image
    },
    views,
    categories,
    mainImage,
    galleryImages[] {
      asset->,
      alt,
      caption
    },
    images[]{
      ...,
      asset->
    },
    body,
    seoTitle,
    metaDescription,
    keywords,
  }
`);

export const NEWS_POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug && "News" in categories[]->title][0] {
    _id,
    title,
    slug,
    publishedAt,
    _createdAt,
    _updatedAt,
    author -> {
      name, image
    },
    views,
    categories[]->{
      title,
      slug,
      parent->{
        title,
        slug
      }
    },
    mainImage,
    body,
    seoTitle,
    metaDescription,
    keywords,
    excerpt,
    location,
    sources
  }
`);

export const BLOG_QUERY =
  defineQuery(`*[_type == "post" ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    _createdAt,
    _updatedAt,
    author -> {
        name, image
    },
    views,
    categories[]->{
    title,
    slug
  },
    mainImage,
    body,
     seoTitle,
    metaDescription,
  keywords
}`);

export const TOPSTORIES_QUERY =
  defineQuery(`*[_type == "post" && "TopStories" in categories[]->title  ] | order(publishedAt desc) {
    title,
    slug,
    publishedAt,
    _createdAt,
    _updatedAt,
    author -> {
        name, image
    },
    views,
    categories,
    mainImage,
    body,
     seoTitle,
  metaDescription,
  keywords
}`);

export const PICKFORYOU_QUERY =
  defineQuery(`*[_type == "post" && "PickForYou" in categories[]->title  ] | order(publishedAt desc) {
    title,
    slug,
    publishedAt,
    _createdAt,
    _updatedAt,
    author -> {
        name, image
    },
    views,
    categories,
    mainImage,
    body,
     seoTitle,
  metaDescription,
  keywords
}`);

export const BLOG_BY_CATEGORY_SLUG = defineQuery(`
  *[_type == "post" && 
    count((categories[]->slug.current)[@ == $slug]) > 0 || 
    count((categories[]->parent->slug.current)[@ == $slug]) > 0
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    _createdAt,
    _updatedAt,
    author -> {
      name, image
    },
    views,
    categories[]->{
      title,
      slug,
      parent->{
        title,
        slug
      }
    },
    mainImage,
    galleryImages[] {
      asset->,
      alt,
      caption
    },
    images[]{
      ...,
      asset->
    },
    body,
    seoTitle,
    metaDescription,
    keywords
  }
`);

export const getAboutPageContent = defineQuery(`
   *[_type == "about"][0]{
    name,
    professionalTitle,
    shortBio,
    bio,
    profileImage,
    expertiseAreas,
    stats,
    testimonials,
    metaDescription,
    blogTitle
  }
  
`);
export const getContactPageContent = defineQuery(`
  *[_type == "contactPage"][0]{
    introText,
    email,
    phone,
    address,
    mapEmbedUrl,
    metaDescription
  }
`);

export const getSocialLinks = defineQuery(`
  *[_type == "socialLinks"][0]{ 
    platform,
    url,
    icon,
    order
  }`);

export const BLOG_VIEWS_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug ][0]{
      _id, slug, views
  }
`);

export const getJobs = defineQuery(
  `*[_type == "job"] | order(publishedAt desc){
      title,
      slug,
      jobType,
      companyLogo,
      company,
      location,
      salary,
      requirements,
      description,
      deadline,
      applyLink,
      publishedAt
    }
`,
);

// Get all categories for lifestyle section
// Get posts by multiple category slugs
export const BLOGS_BY_CATEGORY_SLUGS = `
  *[_type == "post" && 
    (
      count((categories[]->slug.current)[@ in $slugs]) > 0 || 
      count((categories[]->parent->slug.current)[@ in $slugs]) > 0
    )
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    _createdAt,
    _updatedAt,
    author -> {
      name, image
    },
    views,
    categories[]->{
      title,
      "slug": slug.current,
      parent->{
        title,
        "slug": slug.current
      }
    },
    mainImage,
    body,
    seoTitle,
    metaDescription,
    keywords
  }
`;

// Get specific lifestyle categories
export const LIFESTYLE_CATEGORIES = `
  *[_type == "category" && slug.current in ["lifestyle", "mentalhealth", "wellness", "nutrition", "weightloss", "home", "self-improvement"]] {
    _id,
    title,
    "slug": slug.current,
    parent->{
      title,
      "slug": slug.current
    }
  }
`;

// // sanity/lib/queries.ts

// // Get posts by sport category
// export const POSTS_BY_SPORT_CATEGORY = `
//   *[_type == "post" && references(*[_type == "category" && slug.current == $sport]._id)] | order(_createdAt desc) {
//     _id,
//     title,
//     slug,
//     mainImage,
//     excerpt,
//     _createdAt,
//     author->{name, image},
//     categories[]->{
//       title,
//       "slug": slug.current,
//       description
//     }
//   }
// `;

// // Get all sport categories
// export const SPORT_CATEGORIES = `
//   *[_type == "category" && slug.current in ["sports", "football", "basketball", "tennis", "boxing", "athletics", "golf", "rugby"]] {
//     _id,
//     title,
//     "slug": slug.current,
//     description
//   }
// `;

// // Get posts by multiple sport categories
// export const POSTS_BY_SPORT_CATEGORIES = `
//   *[_type == "post" && references(*[_type == "category" && slug.current in $sports]._id)] | order(_createdAt desc) {
//     _id,
//     title,
//     slug,
//     mainImage,
//     excerpt,
//     _createdAt,
//     author->{name, image},
//     categories[]->{
//       title,
//       "slug": slug.current,
//       description
//     }
//   }
// `;

// sanity/lib/queries.ts

// Get posts by multiple sports category slugs
export const BLOGS_BY_SPORTS_SLUGS = `
  *[_type == "post" && 
    (
      count((categories[]->slug.current)[@ in $slugs]) > 0 || 
      count((categories[]->parent->slug.current)[@ in $slugs]) > 0
    )
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    _createdAt,
    _updatedAt,
    author -> {
      name, image
    },
    views,
    categories[]->{
      title,
      "slug": slug.current,
      parent->{
        title,
        "slug": slug.current
      }
    },
    mainImage,
    body,
    seoTitle,
    metaDescription,
    keywords
  }
`;

// Get specific sports categories
export const SPORTS_CATEGORIES = `
  *[_type == "category" && slug.current in ["sports", "football", "basketball", "tennis", "athletics", "boxing", "golf", "motorsports"]] {
    _id,
    title,
    "slug": slug.current,
    parent->{
      title,
      "slug": slug.current
    }
  }
`;

export const BLOG_BY_CATEGORY_AND_REGION = `
  *[_type == "post" && category->slug.current == $slug] |
  order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    _createdAt,
    _updatedAt,
    excerpt,
    regions,
    author -> {name, image},
    categories[]->{
      title,
      "slug": slug.current
    }
  }
`;

// If you want region filtering, you need a different query:
export const BLOG_BY_CATEGORY_REGION_FILTERED = `
  *[_type == "post" && category->slug.current == $slug && 
    (!defined(regions) || count(regions) == 0 || $region == "global" || $region in regions)] |
  order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    publishedAt,
    _createdAt,
    _updatedAt,
    excerpt,
    regions,
    author -> {name, image},
    categories[]->{
      title,
      "slug": slug.current
    }
  }
`;

// Get posts by multiple news category slugs
export const BLOGS_BY_NEWS_SLUGS = `
  *[_type == "post" && 
    (
      count((categories[]->slug.current)[@ in $slugs]) > 0 || 
      count((categories[]->parent->slug.current)[@ in $slugs]) > 0
    )
  ] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    _createdAt,
    _updatedAt,
    author -> {
      name, image
    },
    views,
    categories[]->{
      title,
      "slug": slug.current,
      parent->{
        title,
        "slug": slug.current
      }
    },
    mainImage,
    body,
    seoTitle,
    metaDescription,
    keywords
  }
`;

// Get specific news categories
export const NEWS_CATEGORIES = `
  *[_type == "category" && slug.current in ["world", "business", "technology", "health", "science", "sports"]] {
    _id,
    title,
    "slug": slug.current,
    parent->{
      title,
      "slug": slug.current
    }
  }
`;

// Update your BLOG_BY_CATEGORY_SLUG query to support pagination
export const BLOG_BY_CATEGORY_SLUG_PAGINATED = `
  *[_type == "post" && 
    count((categories[]->slug.current)[@ == $slug]) > 0
  ] | order(publishedAt desc) [$start...$end] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    _createdAt,
    _updatedAt,
    author -> {
      name, image
    },
    views,
    categories[]->{
      title,
      "slug": slug.current,
      parent->{
        title,
        "slug": slug.current
      }
    },
    mainImage,
    body,
    seoTitle,
    metaDescription,
    keywords
  }
`;
