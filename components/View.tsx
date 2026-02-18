import { client } from '@/sanity/lib/client'
import { BLOG_VIEWS_QUERY } from '@/sanity/lib/queries'
import React from 'react'
import Ping from './Ping';
import { after  } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';

const View = async ({ slug }: { slug: string }) => {
    try {
      const result = await client
        .withConfig({ useCdn: false })
        .fetch(BLOG_VIEWS_QUERY, {slug});
      
      const { views: totalViews = 0, _id: postId } = result || {};

      // Only increment views if we have a postId (skip during static generation if no credentials)
      if (postId && process.env.SANITY_API_WRITE_TOKEN) {
        try {
          after(
            async () =>
              await writeClient
                .patch(postId)
                .set({ views: totalViews + 1 })
                .commit()
                .catch(() => {
                  // Silent fail if write fails (e.g., during build)
                }),
          );
        } catch (error) {
          // Silent fail on view increment errors
        }
      }

      const viewCount = result?.views || 0;

      return (
        <div className='flex justify-end items-center mt-5 fixed bottom-3 right-3'>
          <div className='absolute -top-2 -right-2'>
            <Ping />
          </div>
          <p className='font-medium text-[16px] bg-primary-100 px-4 py-2 rounded-lg capitalize'>
            <span className='font-black'>Views: {viewCount}</span>
          </p>
        </div>
      );
    } catch (error) {
      console.error('Error fetching views:', error);
      return (
        <div className='flex justify-end items-center mt-5 fixed bottom-3 right-3'>
          <div className='absolute -top-2 -right-2'>
            <Ping />
          </div>
          <p className='font-medium text-[16px] bg-primary-100 px-4 py-2 rounded-lg capitalize'>
            <span className='font-black'>Views: 0</span>
          </p>
        </div>
      );
    }
  }

export default View