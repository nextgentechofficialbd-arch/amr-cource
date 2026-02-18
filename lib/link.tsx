
'use client';

import React from 'react';
import { useRouter } from './navigation';

/**
 * Mock implementation of next/link for the preview environment.
 */
const Link = ({ href, children, className, onClick, ...props }: any) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick(e);
    
    // Handle standard navigation
    if (href && !href.startsWith('http') && !href.startsWith('#') && !e.defaultPrevented) {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
