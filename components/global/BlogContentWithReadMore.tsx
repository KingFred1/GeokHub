"use client";
import React, { useState, useEffect } from "react";
import { FaReadme } from "react-icons/fa6";

export default function BlogContentWithReadMore({
  parsedContent,
  plainTextContent,
  wordLimit = 150,
}: {
  parsedContent: string;
  plainTextContent: string;
  wordLimit?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const words = plainTextContent.split(/\s+/).filter(Boolean);
  const isTruncated = words.length > wordLimit;

  useEffect(() => {
    if (expanded) {
      // Multiple ways to ensure code enhancement runs
      setTimeout(() => {
        // Method 1: Custom event
        window.dispatchEvent(new CustomEvent('contentExpanded'));
        
        // Method 2: Direct enhancement if available
        if (window.Prism) {
          window.Prism.highlightAll();
        }
        
        // Method 3: Force reflow to ensure DOM is ready
        document.body.clientHeight;
      }, 400);
    }
  }, [expanded]);

  if (!isTruncated) {
    return (
      <div 
        className="prose dark:prose-invert max-w-full"
        dangerouslySetInnerHTML={{ __html: parsedContent }} 
      />
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className={`prose dark:prose-invert max-w-full ${
          !expanded ? 'max-h-96 overflow-hidden' : ''
        }`}
        dangerouslySetInnerHTML={{
          __html: parsedContent,
        }}
      />
      
      {!expanded && (
        <div className="text-center mt-6 opacity">
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-lg transition-colors duration-200 mx-auto"
            onClick={() => setExpanded(true)}
          >
            <FaReadme className="size-4" />
            Continue Reading
          </button>
        </div>
      )}
    </div>
  );
}