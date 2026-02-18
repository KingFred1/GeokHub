"use client";

import { useState, useEffect } from "react";
import { HeartIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const LikeButton = ({ postId }: { postId: string }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/likes?postId=${postId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch likes");
        }

        const data = await res.json();

        // Make sure data is valid
        if (data && typeof data.count === "number") {
          setLikes(data.count || 0);
          if (session?.user?.id) {
            setLiked(data.userLiked || false);
          }
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [postId, session]);

  const handleLike = async () => {
    if (!session) return alert("You must be logged in to like a post");

    const res = await fetch(`/api/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });

    const data = await res.json();

    if (data.liked) {
      setLikes((prev) => prev + 1);
      setLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setLiked(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 text-gray-400 hover:text-red-500"
    >
      <HeartIcon
        className={`size-5 ${liked ? "text-red-500 fill-red-500" : "text-gray-500"}`}
      />
      <span>{likes}</span>
    </button>
  );
};

export default LikeButton;
