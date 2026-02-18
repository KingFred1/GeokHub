'use client';

import { useEffect, useState } from 'react';

export default function ClientOnly({ 
  children,
  fallback = <div className="min-h-[200px] flex items-center justify-center">
    <div className="animate-pulse">Loading...</div>
  </div>
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}