// app/analytics/pageview.ts
'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function usePageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    window.gtag?.('config', 'G-9S4BL5BLBD', {
      page_path: url,
    });
  }, [pathname, searchParams]);
}
