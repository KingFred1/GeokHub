import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '78gw77n7',
  dataset: 'production',
  apiVersion: '2023-01-01',
  token: 'ski4T9jp4zL0ZTl3QS32RUI4KfZhZ3ylfrJ8v5iAdu2pYwakaSvuxUl9aYbuX4Od3ASVJXQvLDG8mhS2JWdY3sjzR2ApcjPeYxc3r8Hue1gyrrv46ub9Z1TfXTCjRMiibLKDVYu7N1vOJqZ4Qjp4A3DYqyaR74NVpYoXqBjG9XPFjTaF4cWc', // must have write access
  useCdn: false,
})

// 👉 Map category slug → author slug
const categoryAuthorMap = {
  'world': 'daniel-okoye',
  'news': 'daniel-okoye',
  'business': 'judith-garcia',
  'tech-news': 'sophia-bennett',
  'ai': 'ethan-carter',
  'programming': 'ethan-carter',
  'cybersecurity': 'ethan-carter',
  'cloud-devops': 'ethan-carter',
  'emerging-tech': 'ethan-carter',
  'gadgets': 'ethan-carter',
  'lifestyle': 'maya-thompson',
  'wellness': 'maya-thompson',
  'mentalhealth': 'maya-thompson',
  'weightloss': 'maya-thompson',
}

async function assignAuthors() {
  for (const [categorySlug, authorSlug] of Object.entries(categoryAuthorMap)) {

    // 1. Get category
    const category = await client.fetch(
      `*[_type == "category" && slug.current == $slug][0]`,
      { slug: categorySlug }
    )

    if (!category) {
      console.log(`❌ Category not found: ${categorySlug}`)
      continue
    }

    // 2. Get author
    const author = await client.fetch(
      `*[_type == "author" && slug.current == $slug][0]`,
      { slug: authorSlug }
    )

    if (!author) {
      console.log(`❌ Author not found: ${authorSlug}`)
      continue
    }

    // 3. Update category with author reference
    await client
      .patch(category._id)
      .set({
        author: {
          _type: 'reference',
          _ref: author._id,
        },
      })
      .commit()

    console.log(`✅ Assigned ${authorSlug} → ${categorySlug}`)
  }

  console.log('🎉 Done assigning authors to categories!')
}

assignAuthors()