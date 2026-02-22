
'use client';

import dynamic from 'next/dynamic';
import { Post } from '@/sanity/types';

const NewsSwiper = dynamic(() => import('./NewsSwiper'), { ssr: false });

export default function ClientNewsSwiper({ post }: { post: Post[] }) {
  return <NewsSwiper post={post} />;
}
