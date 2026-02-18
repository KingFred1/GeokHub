'use client';

import { useEffect, useState } from 'react';

export function useClientTime() {
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
  }, []);

  return { isClient, currentTime };
}

export function useFormattedTimeShort(dateString: string): string {
  const { isClient, currentTime } = useClientTime();
  const [formatted, setFormatted] = useState('recently');

  useEffect(() => {
    if (isClient && currentTime && dateString) {
      try {
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((currentTime.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) setFormatted("just now");
        else if (diffInSeconds < 3600) setFormatted(`${Math.floor(diffInSeconds / 60)}m`);
        else if (diffInSeconds < 86400) setFormatted(`${Math.floor(diffInSeconds / 3600)}h`);
        else if (diffInSeconds < 604800) setFormatted(`${Math.floor(diffInSeconds / 86400)}d`);
        else setFormatted(`${Math.floor(diffInSeconds / 604800)}w`);
      } catch {
        setFormatted("recently");
      }
    }
  }, [isClient, currentTime, dateString]);

  return formatted;
}