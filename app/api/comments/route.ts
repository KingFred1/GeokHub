// import { NextResponse } from "next/server";
// import { eq, and } from "drizzle-orm"; // Added 'and' import
// import { db } from "@/database/drizzle";
// import { comments, likes, user } from "@/database/schema";
// import { auth } from "@/auth";

// // ✅ Create a New Comment
// export async function POST(req: Request) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized or missing user ID" }, { status: 401 });
//     }

//     const { postId, content, parentId } = await req.json();
//     if (!postId || !content) {
//       return NextResponse.json({ error: "Post ID and content required" }, { status: 400 });
//     }

//     await db.insert(comments).values({
//       postId,
//       userId: session.user.id,
//       content,
//       parentId: parentId || null,
//     });

//     return NextResponse.json({ message: "Comment added successfully" });
//   } catch (error) {
//     console.error("Error in POST /comments:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// // ✅ Fetch Comments for a Post

// export async function GET(req: Request) {
//   try {
//     const session = await auth();
//     const { searchParams } = new URL(req.url);
//     const postId = searchParams.get("postId");

//     if (!postId) {
//       return NextResponse.json({ error: "Post ID required" }, { status: 400 });
//     }

//     const postComments = await db
//       .select({
//         id: comments.id,
//         content: comments.content,
//         createdAt: comments.createdAt,
//         parentId: comments.parentId,
//         userId: comments.userId,
//         reaction: likes.reaction,
//         user: {
//           name: user.name,
//           image: user.image,
//         },
//       })
//       .from(comments)
//       .leftJoin(user, eq(comments.userId, user.id))
//       .leftJoin(
//         likes,
//         and(
//           eq(likes.commentId, comments.id),
//           eq(likes.userId, session?.user?.id || "")
//         )
//       )
//       .where(eq(comments.postId, postId));

//     // Process the data to handle potential duplicates
//     const commentsMap = new Map();
//     postComments.forEach(comment => {
//       if (!commentsMap.has(comment.id)) {
//         commentsMap.set(comment.id, {
//           ...comment,
//           replies: [],
//           liked: comment.reaction === 'like'
//         });
//       }
//     });

//     // Convert back to array
//     const uniqueComments = Array.from(commentsMap.values());

//     return NextResponse.json(uniqueComments);
//   } catch (error) {
//     console.error("Error in GET /comments:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// // ✅ Delete a Comment
// export async function DELETE(req: Request) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { commentId } = await req.json();
//     if (!commentId) {
//       return NextResponse.json({ error: "Comment ID required" }, { status: 400 });
//     }

//     const existingComment = await db
//       .select()
//       .from(comments)
//       .where(eq(comments.id, commentId))
//       .limit(1);

//     if (!existingComment.length) {
//       return NextResponse.json({ error: "Comment not found" }, { status: 404 });
//     }

//     const comment = existingComment[0];
//     if (comment.userId !== session.user.id) {
//       return NextResponse.json({ error: "You can only delete your own comment" }, { status: 403 });
//     }

//     await db.delete(comments).where(eq(comments.id, commentId));
//     return NextResponse.json({ message: "Comment deleted successfully" });
//   } catch (error) {
//     console.error("Error in DELETE /comments:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
