
'use client';

/**
 * Mock implementation of next/navigation for the preview environment.
 */

export const useRouter = () => {
  return (window as any).mockRouter || {
    push: (url: string) => {
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    replace: (url: string) => {
      window.history.replaceState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => window.location.reload(),
    prefetch: () => {},
  };
};

export const usePathname = () => {
  return (window as any).mockPathname || window.location.pathname;
};

export const useSearchParams = () => {
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  return {
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
    has: (key: string) => searchParams.has(key),
    entries: () => searchParams.entries(),
    keys: () => searchParams.keys(),
    values: () => searchParams.values(),
    toString: () => searchParams.toString(),
    forEach: (cb: any) => searchParams.forEach(cb),
  };
};

export const useParams = () => {
  return (window as any).mockParams || {};
};

export default {
  useRouter,
  usePathname,
  useSearchParams,
  useParams
};
