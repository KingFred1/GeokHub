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
  useEffect(() => {
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
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div
        className="prose dark:prose-invert max-w-full"
        dangerouslySetInnerHTML={{
          __html: parsedContent,
        }}
      />
    </div>
  );
}