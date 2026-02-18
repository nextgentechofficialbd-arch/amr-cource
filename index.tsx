
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './app/page';
import LoginPage from './app/login/page';
import DashboardPage from './app/dashboard/page';
import ProgramDetailPage from './app/programs/[slug]/page';
import AdminDashboardPage from './app/admin/page';
import AdminProgramsPage from './app/admin/programs/page';
import AdminPaymentsPage from './app/admin/payments/page';
import AdminPromoCodesPage from './app/admin/promocodes/page';
import AdminStudentsPage from './app/admin/students/page';

// --- Preview Router Logic ---

const AppPreview = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update global mocks used by /lib/navigation.tsx
  (window as any).mockPathname = pathname;
  (window as any).mockRouter = {
    push: (url: string) => {
      window.history.pushState({}, '', url);
      setPathname(url);
      window.scrollTo(0, 0);
    },
    replace: (url: string) => {
      window.history.replaceState({}, '', url);
      setPathname(url);
    },
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => window.location.reload(),
    prefetch: () => {},
  };

  // Simplified routing for the browser preview environment
  const renderRoute = () => {
    // Exact path matches
    if (pathname === '/login') return <LoginPage />;
    if (pathname === '/dashboard') return <DashboardPage />;
    if (pathname === '/admin') return <AdminDashboardPage />;
    if (pathname === '/admin/programs') return <AdminProgramsPage />;
    if (pathname === '/admin/payments') return <AdminPaymentsPage />;
    if (pathname === '/admin/promocodes') return <AdminPromoCodesPage />;
    if (pathname === '/admin/students') return <AdminStudentsPage />;
    
    // Dynamic route matching
    if (pathname.startsWith('/programs/')) {
      const slug = pathname.replace('/programs/', '');
      const paramsPromise = Promise.resolve({ slug });
      (window as any).mockParams = { slug };
      return <ProgramDetailPage params={paramsPromise} />;
    }

    if (pathname.startsWith('/course/')) {
      const slug = pathname.replace('/course/', '');
      const paramsPromise = Promise.resolve({ slug });
      (window as any).mockParams = { slug };
      
      // Dynamic import simulated for the preview
      try {
        const CoursePlayerPage = require('./app/course/[slug]/page').default;
        return <CoursePlayerPage params={paramsPromise} />;
      } catch (e) {
        console.error("Course player not found in current context", e);
        return <Home />;
      }
    }

    // Default Fallback
    return <Home />;
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white selection:bg-blue-600/30 selection:text-white">
      {renderRoute()}
    </div>
  );
};

// --- App Bootstrapping ---

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AppPreview />
    </React.StrictMode>
  );
}
