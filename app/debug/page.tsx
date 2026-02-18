// app/debug/page.tsx
'use client';

import { useEffect } from 'react';

export default function DebugPage() {
  useEffect(() => {
    // Catch ALL errors
    window.addEventListener('error', (event) => {
      console.error('❌ ERROR CAUGHT:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Catch promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('❌ UNHANDLED PROMISE:', event.reason);
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug Page</h1>
      <p>Check browser console for JavaScript errors</p>
      <button onClick={() => console.log('Test button clicked')}>
        Test Button
      </button>
    </div>
  );
}