// import { NextResponse } from "next/server";

// import { eq, and } from "drizzle-orm";
// import { db } from "@/database/drizzle";
// import { likes } from '../../../database/schema';
// import { auth } from "@/auth";


// export async function POST(req: Request) {
//     try {
//       const session = await auth();
      
//       // console.log("Session Data:", session); // Debugging
  
//       if (!session || !session.user || !session.user.id) {
//         return NextResponse.json({ error: "Unauthorized or missing user ID" }, { status: 401 });
//       }
  
//       const { postId } = await req.json();
//       if (!postId) return NextResponse.json({ error: "Post ID required" }, { status: 400 });
  
//       const userId = session.user.id;
//       // console.log("User ID:", userId); // Debugging
  
//       // Check if user already liked the post
//       const existingLike = await db
//         .select()
//         .from(likes)
//         .where(and(eq(likes.postId, postId), eq(likes.userId, userId)))
//         .limit(1);
  
//       if (existingLike.length > 0) {
//         // User already liked → Remove Like
//         await db.delete(likes).where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
//         return NextResponse.json({ message: "Unliked successfully", liked: false });
//       } else {
//         // User has not liked → Add Like
//         await db.insert(likes).values({ postId, userId });
//         return NextResponse.json({ message: "Liked successfully", liked: true });
//       }
//     } catch (error) {
//       console.error("Error in like API:", error);
//       return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
//   }