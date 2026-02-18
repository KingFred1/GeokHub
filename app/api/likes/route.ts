// import { NextResponse } from "next/server";
// import { eq, and } from "drizzle-orm";
// import { db } from "@/database/drizzle";
// import { likes } from "@/database/schema";
// import { auth } from "@/auth";

// // ✅ Fetch Likes Count and User Like Status
// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const postId = url.searchParams.get("postId");
//     if (!postId) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

//     const session = await auth();
//     const userId = session?.user?.id;

//     // Fetch all likes for the post
//     const likesForPost = await db
//       .select()
//       .from(likes)
//       .where(eq(likes.postId, postId));

//     const countValue = likesForPost.length;

//     // Check if the user has already liked the post
//     let userLiked = false;
//     if (userId) {
//       const existingLike = await db
//         .select()
//         .from(likes)
//         .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
//         .limit(1);

//       userLiked = existingLike.length > 0;
//     }

//     return NextResponse.json({
//       count: countValue,
//       userLiked,
//     });
//   } catch (error) {
//     console.error("Error in likes API:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }