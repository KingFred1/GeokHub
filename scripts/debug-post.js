import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '78gw77n7',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.geokhub.com';
const slug = process.argv[2] || 'two-u-s-cybersecurity-professionals-plead-guilty-in-ransomware-conspiracy';

async function fetchCategoryMap() {
  const q = `*[_type == "category"]{ "slug": slug.current, "parentSlug": parent->slug.current, title }`;
  const categories = await client.fetch(q);
  return categories.reduce((acc, c) => {
    acc[c.slug] = { parentSlug: c.parentSlug || null, title: c.title || null };
    return acc;
  }, {});
}

function getPathFromCategory(cat, categoryMap) {
  if (!cat) return null;
  if (cat.parent && cat.parent.slug) return `/${cat.parent.slug}/${cat.slug}`;
  const mappedParent = categoryMap[cat.slug]?.parentSlug;
  if (mappedParent) return `/${mappedParent}/${cat.slug}`;
  if (cat.slug === 'world') return `/news/world`;
  if (cat.slug === 'business') return `/news/business`;
  if (cat.slug === 'news') return `/news`;
  return `/${cat.slug}`;
}

function getPublicUrlForPost(post, categoryMap) {
  if (post.contentType === 'tutorial') return `${BASE_URL}/tutorials/${post.slug}`;
  if (post.categories && post.categories.length > 0) {
    const withParent = post.categories.find(c => c.parent && c.parent.slug);
    if (withParent) return `${BASE_URL}${getPathFromCategory(withParent, categoryMap)}/${post.slug}`;
    const newsLike = post.categories.find(c => ['news','world','business'].includes(c.slug));
    if (newsLike) return `${BASE_URL}${getPathFromCategory(newsLike, categoryMap)}/${post.slug}`;
    return `${BASE_URL}${getPathFromCategory(post.categories[0], categoryMap)}/${post.slug}`;
  }
  return `${BASE_URL}/blogs/${post.slug}`;
}

(async () => {
  try {
    const query = `*[_type == "post" && slug.current == $slug] {title, "slug": slug.current, contentType, categories[]->{"slug": slug.current, title, parent->{"slug": slug.current, title}}}[0]`;
    const post = await client.fetch(query, { slug });
    if (!post) {
      console.error('Post not found for slug:', slug);
      process.exit(1);
    }

    const categoryMap = await fetchCategoryMap();
    console.log('Post:', post.title);
    console.log('Categories:', JSON.stringify(post.categories, null, 2));
    console.log('CATEGORY_MAP entry for first category:', categoryMap[post.categories?.[0]?.slug] || null);
    console.log('Computed public URL:', getPublicUrlForPost(post, categoryMap));
  } catch (err) {
    console.error('Error fetching post:', err.message);
    process.exit(1);
  }
})();
