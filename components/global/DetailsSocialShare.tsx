"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";
import { FaClipboard } from 'react-icons/fa6';

type FloatingActionBarProps = {
  postId: string;
  postUrl: string;
  postTitle: string;
  postDescription?: string;
};

export default function DetailsSocialShare({
  postUrl,
  postTitle,
  postDescription,
}: FloatingActionBarProps) {
  const hashtags = ["GeokHub"];
  const via = "GeokHub";
  const shareText = postDescription ? `${postTitle} - ${postDescription}` : postTitle;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-2 p-2 min-w-[200px] bg-card z-50">
        <FacebookShareButton
          url={postUrl}
          quote={shareText}
          hashtag={hashtags[0]}
          className="w-full"
        >
          <span className="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors w-full">
            <FacebookIcon size={24} round />
            <span>Facebook</span>
          </span>
        </FacebookShareButton>

        <TwitterShareButton
          url={postUrl}
          title={shareText}
          via={via}
          hashtags={hashtags}
          className="w-full"
        >
          <span className="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors w-full">
            <TwitterIcon size={24} round />
            <span>Twitter</span>
          </span>
        </TwitterShareButton>

        <LinkedinShareButton
          url={postUrl}
          title={postTitle}
          summary={postDescription}
          source="GeokHub"
          className="w-full"
        >
          <span className="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors w-full">
            <LinkedinIcon size={24} round />
            <span>LinkedIn</span>
          </span>
        </LinkedinShareButton>

        <WhatsappShareButton
          url={postUrl}
          title={shareText}
          separator=": "
          className="w-full"
        >
          <span className="flex items-center gap-2 p-2 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors w-full">
            <WhatsappIcon size={24} round />
            <span>WhatsApp</span>
          </span>
        </WhatsappShareButton>
      <Button
        variant="ghost"
        onClick={handleCopyLink}
        className="flex items-center gap-2 justify-start hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
        aria-label="Copy link"
      >
        <span className="flex gap-2"> <FaClipboard /> Copy Link</span>
      </Button>
    </div>
  );
}