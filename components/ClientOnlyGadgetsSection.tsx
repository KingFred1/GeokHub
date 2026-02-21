
'use client';

import dynamic from 'next/dynamic';
import { Post } from '@/sanity/types';

const GadgetsSection = dynamic(() => import('./GadgetsSection'), { ssr: false });

interface Props {
  post: Post[];
}

export default function ClientOnlyGadgetsSection({ post }: Props) {
  return <GadgetsSection post={post} />;
}
