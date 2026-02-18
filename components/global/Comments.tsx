"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  image: string;
}

interface CommentLike {
  userId: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  user: User;
  parentId: string | null;
  parentUser?: User;
  replies: Comment[];
  likes: CommentLike[];
  _count?: {
    likes: number;
  };
  liked?: boolean;
  createdAt: string;
}

interface ApiComment {
  id: string;
  content: string;
  userId: string;
  user: User;
  parentId: string | null;
  likes: CommentLike[];
  _count: {
    likes: number;
  };
  createdAt: string;
}

interface LikesResponse {
  likesCount: number;
  userLiked: boolean;
}

const Comments = ({ postId }: { postId: string }) => {
  const { data: session } = useSession();
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // State variables
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [menuOpen, setMenuOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data: ApiComment[] = await res.json();
      
      // Create a map of all comments with initialized likes
      const commentMap: Record<string, Comment> = {};
      
      // First pass: create all comments with their basic data
      data.forEach((c: ApiComment) => {
        commentMap[c.id] = {
          ...c,
          replies: [],
          likes: c._count?.likes || 0,
          liked: c.likes?.some((like: CommentLike) => like.userId === session?.user?.id) || false
        };
      });
  
      // Second pass: build the hierarchy
      const topLevel: Comment[] = [];
      data.forEach((c: ApiComment) => {
        if (c.parentId) {
          const parent = commentMap[c.parentId];
          if (parent) {
            commentMap[c.id].parentUser = parent.user;
            parent.replies.push(commentMap[c.id]);
          }
        } else {
          topLevel.push(commentMap[c.id]);
        }
      });
  
      setComments(topLevel);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const fetchLikes = async (commentId: string): Promise<LikesResponse | undefined> => {
    if (!session?.user?.id) return;
    
    try {
      const res = await fetch(
        `/api/comments/likes?commentId=${commentId}&postId=${postId}&userId=${session.user.id}`
      );
      const data: LikesResponse = await res.json();
      
      if (res.ok) {
        return data;
      } else {
        console.error("Error fetching likes", data);
      }
    } catch (err) {
      console.error("Error in fetchLikes:", err);
    }
  };

  useEffect(() => {
    if (comments.length > 0) {
      comments.forEach(async (comment) => {
        const likesData = await fetchLikes(comment.id);
        if (likesData) {
          setComments((prevComments) =>
            updateCommentInState(prevComments, comment.id, {
              likes: likesData.likesCount,
              liked: likesData.userLiked,
            })
          );
        }
      });
    }
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      return (window.location.href = "/api/auth/signin");
    }

    if (!comment.trim()) return;
    setLoading(true);

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: comment,
          parentId: replyingTo?.id,
        }),
      });
      setComment("");
      setReplyingTo(null);
      await fetchComments();
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!session) {
      return (window.location.href = "/api/auth/signin");
    }

    try {
      const userId = session.user.id;
      const res = await fetch("/api/comments/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setComments(prev =>
          updateCommentInState(prev, commentId, {
            liked: data.userLiked,
            likes: data.likesCount,
          })
        );
      }
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  const updateCommentInState = (commentList: Comment[], id: string, data: Partial<Comment>): Comment[] => {
    return commentList.map((c) => {
      if (c.id === id) {
        return { 
          ...c, 
          ...data,
          replies: c.replies || [],
        };
      }
      if (c.replies) {
        return {
          ...c,
          replies: updateCommentInState(c.replies, id, data),
        };
      }
      return c;
    });
  };

  const handleDelete = async (commentId: string) => {
    try {
      await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      await fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleEdit = async (commentId: string) => {
    try {
      await fetch("/api/comments/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, content: editedContent }),
      });
      setEditingCommentId(null);
      setEditedContent("");
      await fetchComments();
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const scrollToCommentInput = () => {
    commentInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const renderComment = (c: Comment, depth = 0) => {
    const marginLeft = depth * 24;
  
    return (
      <motion.div 
        key={c.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`border p-2 rounded-md mb-2 bg-card`}
        style={{ marginLeft: `${marginLeft}px` }}
      >
        {/* Comment header with user info */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Image
              width={50}
              height={50}
              src={c.user?.image ?? "/default-avatar.png"}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{c.user?.name ?? "Unknown User"}</p>
              {c.parentId && (
                <p className="text-xs text-gray-400">
                  Replying to {c.parentUser?.name}
                </p>
              )}
            </div>
          </div>
  
          {/* Comment menu */}
          {session?.user?.id === c.userId && (
            <div className="relative">
              <button onClick={() => setMenuOpen(prev => ({ ...prev, [c.id]: !prev[c.id] }))}>
                ...
              </button>
              {menuOpen[c.id] && (
                <div className="absolute rounded shadow p-2 right-0 mt-1 z-10 bg-background">
                  <button
                    onClick={() => {
                      setEditingCommentId(c.id);
                      setEditedContent(c.content);
                      setMenuOpen({});
                    }}
                    className="block w-full text-sm hover:bg-gray-600 px-2 py-1 text-left"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(c.id);
                      setMenuOpen({});
                    }}
                    className="block w-full text-sm text-red-400 hover:bg-gray-600 px-2 py-1 text-left"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
  
        {/* Comment content */}
        {editingCommentId === c.id ? (
          <div className="mt-2">
            <textarea
              className="w-full p-2 rounded bg-background border"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(c.id)}
                className="bg-green-600 px-3 py-1 rounded text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingCommentId(null);
                  setEditedContent("");
                }}
                className="bg-red-400 px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2">{c.content}</p>
        )}
  
        {/* Comment actions */}
        <div className="flex items-center gap-3 mt-2">
        <button
      onClick={() => handleLike(c.id)}
      className="flex items-center gap-1"
    >
      {c.liked ? "💙" : "🤍"}
      <span className="ml-1">{c.likes}</span> {/* Always show count */}
    </button>
  
          <button
            onClick={() => {
              setReplyingTo(c);
              scrollToCommentInput();
            }}
            className="text-sm text-blue-500 hover:underline"
          >
            Reply
          </button>
  
          {c.replies?.length > 0 && (
            <button
              onClick={() => toggleReplies(c.id)}
              className="text-sm text-blue-500 hover:underline"
            >
              {expandedComments[c.id] 
                ? "Hide replies" 
                : `Show replies (${c.replies.length})`}
            </button>
          )}
        </div>
  
        {/* Nested replies with animation */}
        {c.replies?.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: expandedComments[c.id] ? "auto" : 0,
              opacity: expandedComments[c.id] ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {expandedComments[c.id] && (
              <div className="mt-2">
                {c.replies.map((reply) => renderComment(reply, depth + 1))}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="mt-6 border-t border-card pt-4">
      <h3 className="text-lg font-bold mb-2">Comments</h3>
      
      {replyingTo && (
        <div className="text-sm text-gray-300 mb-2">
          Replying to <span className="font-semibold">{replyingTo.user?.name}</span>
          <button
            onClick={() => setReplyingTo(null)}
            className="ml-4 text-red-400 hover:underline"
          >
            Cancel Reply
          </button>
        </div>
      )}

      {session ? (
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={commentInputRef}
            className="w-full p-3 pr-12 rounded-lg border border-gray-300 bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              replyingTo
                ? `Reply to ${replyingTo.user?.name}...`
                : "Write a comment..."
            }
            rows={3}
          />
          <button
            type="submit"
            disabled={!comment.trim() || loading}
            className={`absolute right-3 bottom-3 p-1 rounded-full ${comment.trim() ? 'text-blue-500' : 'text-gray-400'}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </form>
      ) : (
        <div className="text-gray-300 mt-2">
          You must{" "}
          <Link href="/api/auth/signin" className="text-blue-500 underline">
            sign in
          </Link>{" "}
          to comment.
        </div>
      )}

      <div className="mt-4" id="comments-section">
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <p className="text-gray-400">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default Comments;