"use client";
import { useEffect, useState } from "react";
import { CommentIcon } from "@sanity/icons";

const CommentCount = ({ postId }) => {
  const [count, setCount] = useState(0);

  // const handleScrollToComments = () => {
  //   const commentsEl = document.getElementById("comments-section");
  //   if (commentsEl) {
  //     commentsEl.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const res = await fetch(`/api/comments/count?postId=${postId}`);
        const data = await res.json();
        if (res.ok) {
          setCount(data.count);
        }
      } catch (err) {
        console.error("Failed to fetch comment count:", err);
      }
    };

    fetchCommentCount();
  }, [postId]);

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      {/* <button onClick={handleScrollToComments} className="flex items-center gap-2"> */}
      <button className="flex items-center gap">
        <CommentIcon height={30} width={30}  />
        <span>{count}</span>
      </button>
    </div>
  );
};

export default CommentCount;
