
'use client';

import dynamic from 'next/dynamic';
import { Post } from '@/sanity/types';

// dynamic import of the heavy client component, no SSR
const SwipeBlog = dynamic(() => import('./SwipeBlog'), { ssr: false });

interface Props {
  posts: Post[];
}

export default function ClientOnlySwipeBlog({ posts }: Props) {
  return <SwipeBlog posts={posts} />;
}
