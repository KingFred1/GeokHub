"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import LikeButton from "@/components/global/LikeButton";
// import CommentCount from "@/components/global/CommentCount";
import { Share2 } from 'lucide-react';
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

type FloatingActionBarProps = {
  postId: string;
  postUrl: string;
  postTitle: string;
  postDescription?: string;
};

export default function FloatingActionBar({ 
  postUrl, 
  postTitle,
  postDescription 
}: FloatingActionBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const hashtags = ["GeokHub"];
  const via = "GeokHub";
  const shareText = postDescription ? `${postTitle} - ${postDescription}` : postTitle;

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    toast.success("Link copied to clipboard!");
    setShowShareOptions(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            {/* <LikeButton postId={postId} />
            <CommentCount postId={postId} /> */}
            
            {/* Share Button with Dropdown */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Share article"
              >
                <Share2 className="h-5 w-5" />
              </Button>

              {/* Share Options Dropdown */}
              {showShareOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col gap-2">
                    <FacebookShareButton
                    quote={shareText}
                      hashtag={hashtags[0]} 
                      url={postUrl}
                      onClick={() => setShowShareOptions(false)}
                    >
                      <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <FacebookIcon size={24} round />
                        <span>Facebook</span>
                      </div>
                    </FacebookShareButton>

                    <TwitterShareButton 
                     title={shareText}
                      via={via}
                      hashtags={hashtags}
                      url={postUrl}
                      onClick={() => setShowShareOptions(false)}
                    >
                      <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <TwitterIcon size={24} round />
                        <span>Twitter</span>
                      </div>
                    </TwitterShareButton>

                    <LinkedinShareButton 
                    title={postTitle}
                      summary={postDescription}
                      source="GeokHub"
                      url={postUrl}
                      onClick={() => setShowShareOptions(false)}
                    >
                      <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <LinkedinIcon size={24} round />
                        <span>LinkedIn</span>
                      </div>
                    </LinkedinShareButton>

                    <WhatsappShareButton 
                      title={shareText}
                      separator=": "
                                       url={postUrl}

                      onClick={() => setShowShareOptions(false)}
                    >
                      <div className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <WhatsappIcon size={24} round />
                        <span>WhatsApp</span>
                      </div>
                    </WhatsappShareButton>

                    <Button
                      variant="ghost"
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 justify-start"
                    >
                      <span>Copy Link</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}