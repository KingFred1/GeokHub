// components/PortableTextComponent.js
'use client';

import { PortableText } from '@portabletext/react';

const components = {
  block: {
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mb-3">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-indigo-500 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a href={value.href} className="text-indigo-600 hover:underline">
        {children}
      </a>
    ),
  },
};

export default function PortableTextComponent({ value }) {
  return <PortableText value={value} components={components} />;
}