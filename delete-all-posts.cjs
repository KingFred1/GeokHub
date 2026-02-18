// 
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '78gw77n7',
  dataset: 'production',
  useCdn: false,
  token: 'ski4T9jp4zL0ZTl3QS32RUI4KfZhZ3ylfrJ8v5iAdu2pYwakaSvuxUl9aYbuX4Od3ASVJXQvLDG8mhS2JWdY3sjzR2ApcjPeYxc3r8Hue1gyrrv46ub9Z1TfXTCjRMiibLKDVYu7N1vOJqZ4Qjp4A3DYqyaR74NVpYoXqBjG9XPFjTaF4cWc'
})

async function deleteAllPosts() {
  try {
    console.log('🗑️  Force deleting all non-tech posts...')
    
    // Get all post IDs (ignore references)
    const postIds = await client.fetch(`
      *[_type == "post" && categories[0]->title in ["Trending"]]._id
    `)
    
    console.log(`📊 Found ${postIds.length} posts to delete`)
    
    if (postIds.length === 0) {
      console.log('✅ No posts found matching criteria')
      return
    }

    // Delete one by one to handle errors gracefully
    let deletedCount = 0
    let errorCount = 0
    
    for (let i = 0; i < postIds.length; i++) {
      try {
        await client.delete(postIds[i])
        deletedCount++
        if (deletedCount % 10 === 0) {
          console.log(`Progress: ${deletedCount}/${postIds.length}`)
        }
      } catch (error) {
        errorCount++
        console.log(`❌ Could not delete post ${i + 1}: ${error.message}`)
      }
    }
    
    console.log(`\n🎉 Results:`)
    console.log(`✅ Successfully deleted: ${deletedCount} posts`)
    console.log(`❌ Failed to delete: ${errorCount} posts (due to references)`)
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
  }
}

deleteAllPosts()