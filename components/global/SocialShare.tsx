"use client";

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
import { useState } from "react";

type Props = {
  url: string;
  title: string;
  image?: string;
  description?: string;
};

export default function SocialShare({ url, title, description }: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const hashtags = ["GeokHub"]; // Customize your hashtags here
  const via = "GeokHub"; // Customize the "via" attribution for Twitter

  // Prepare the share text combining title and description
  const shareText = description ? `${title} - ${description}` : title;

  return (
    <div className="my-4">
      {/* Large Screen: Show all icons */}
      <div className="hidden lg:flex gap-3 items-center">
        <FacebookShareButton
          hashtag={hashtags[0]}
          quote={shareText}
          url={url}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <TwitterShareButton
          title={shareText}
          via={via}
          hashtags={hashtags}
          url={url}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <LinkedinShareButton
          summary={description}
          title={title}
          source="GeokHub"
          url={url}
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>

        <WhatsappShareButton
          url={url}
          // title={shareText}
          separator=": "
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>

      {/* Small Screen: Show toggle button */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowOptions((prev) => !prev)}
          className="px-3 py-1.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Share
        </button>

        {showOptions && (
          <div className="mt-2 flex gap-3">
            <FacebookShareButton
              quote={shareText}
              hashtag={hashtags[0]}
              url={url}
            >
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <TwitterShareButton
             title={shareText}
              via={via}
              hashtags={hashtags}
              url={url}
             
            >
              <TwitterIcon size={32} round />
            </TwitterShareButton>

            <LinkedinShareButton
            title={title}
              summary={description}
              source="GeokHub"
              url={url}
              
            >
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>

            <WhatsappShareButton
              url={url}
              // title={shareText}
              separator=": "
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        )}
      </div>
    </div>
  );
}
