import React from 'react';

const MarkdownContent = ({ content }) => {
  return (
    <div 
      className="prose dark:prose-invert max-w-full"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default MarkdownContent;