"use client";

import { useState, useRef, useEffect } from "react";
import { Share } from "lucide-react";
import DetailsSocialShare from "./DetailsSocialShare";

type Props = {
  postId: string;
  postUrl: string;
  postTitle: string;
  postDescription?: string;
};

export default function SidebarShareButton({
  postId,
  postUrl,
  postTitle,
  postDescription,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className=""
        onClick={() => setOpen((v) => !v)}
        aria-label="Share this post"
        type="button"
      >
        <Share className="w-6 h-6 text-primary" />
      </button>
      {open && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 w-56 bg-card">
          <DetailsSocialShare
            postId={postId}
            postUrl={postUrl}
            postTitle={postTitle}
            postDescription={postDescription}
          />
        </div>
      )}
    </div>
  );
}