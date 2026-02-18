'use client';

import { useEffect, useState } from 'react';

export default function HydrationFix({ 
  children,
  fallback = null 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Don't render anything during server rendering
  // Only render after hydration is complete
  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}