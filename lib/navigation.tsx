
'use client';

/**
 * Mock implementation of next/navigation for the preview environment.
 * This satisfies the 'useRouter', 'usePathname', and 'useSearchParams' hooks.
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
  if (typeof window === 'undefined') return new URLSearchParams();
  return new URLSearchParams(window.location.search);
};

export const useParams = () => {
  // In a real Next.js app this returns route params. 
  // For the preview, index.tsx handles the mapping.
  return (window as any).mockParams || {};
};
