import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Landing } from '@/pages/Landing';
import { DesignSystemPreview } from '@/pages/DesignSystemPreview';
import { Signup } from '@/pages/Signup';
import { Login } from '@/pages/Login';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';

// Dashboard pages pull in heavy dependencies (recharts, Monaco) that a landing-page-only
// visitor should never have to download. Lazy-loading keeps the public bundle lean.
const Overview = lazy(() => import('@/pages/dashboard/Overview').then((m) => ({ default: m.Overview })));
const EditorPage = lazy(() => import('@/pages/dashboard/EditorPage').then((m) => ({ default: m.EditorPage })));
const SnippetsPage = lazy(() => import('@/pages/dashboard/SnippetsPage').then((m) => ({ default: m.SnippetsPage })));
const ProjectsPage = lazy(() => import('@/pages/dashboard/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const SearchPage = lazy(() => import('@/pages/dashboard/SearchPage').then((m) => ({ default: m.SearchPage })));
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage').then((m) => ({ default: m.SettingsPage })));

function DashboardFallback() {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
      <p className="text-sm text-text-muted">Loading…</p>
    </div>
  );
}

function App() {
  const init = useAuthStore((s) => s.init);

  // On first load, check localStorage for an existing session — synchronous and
  // instant, since there's no server round trip involved at all.
  useEffect(() => {
    init();
  }, [init]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/design-system" element={<DesignSystemPreview />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<DashboardFallback />}>
                <Overview />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/editor"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<DashboardFallback />}>
                <EditorPage />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/snippets"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<DashboardFallback />}>
                <SnippetsPage />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/projects"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<DashboardFallback />}>
                <ProjectsPage />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/search"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<DashboardFallback />}>
                <SearchPage />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Suspense fallback={<DashboardFallback />}>
                <SettingsPage />
              </Suspense>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
