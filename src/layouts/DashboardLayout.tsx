import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderGit2, Code2, FileCode2, Search, Settings, Menu, X, LogOut } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  to?: string; // present only for routes that actually exist
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Editor', icon: Code2, to: '/dashboard/editor' },
  { label: 'Snippets', icon: FileCode2, to: '/dashboard/snippets' },
  { label: 'Projects', icon: FolderGit2, to: '/dashboard/projects' },
  { label: 'Search', icon: Search, to: '/dashboard/search' },
  { label: 'Settings', icon: Settings, to: '/dashboard/settings' },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) =>
        item.to ? (
          <NavLink
            key={item.label}
            to={item.to}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-control text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-primary/10 text-code-keyword'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ) : (
          <div
            key={item.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-control text-sm font-medium text-text-muted/50 cursor-not-allowed"
            title="Coming in a later build step"
          >
            <item.icon size={17} />
            {item.label}
            <span className="ml-auto text-[10px] uppercase tracking-wide bg-bg-elevated px-1.5 py-0.5 rounded">
              Soon
            </span>
          </div>
        )
      )}
    </nav>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-body flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-border-subtle shrink-0">
        <div className="h-16 flex items-center px-5 border-b border-border-subtle">
          <Logo variant="mark" />
        </div>
        <div className="flex-1 py-4">
          <SidebarContent />
        </div>
        <div className="p-4 border-t border-border-subtle">
          <p className="text-xs text-text-muted truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-2 text-sm text-text-muted hover:text-accent-danger transition-colors"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border-subtle flex items-center justify-between px-4 lg:px-6">
          <button
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-control border border-border-subtle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div className="lg:hidden">
            <Logo variant="mark" />
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-bg-primary border-r border-border-subtle flex flex-col">
            <div className="h-16 flex items-center justify-between px-5 border-b border-border-subtle">
              <Logo variant="mark" />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 py-4">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="p-4 border-t border-border-subtle">
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="mt-2 flex items-center gap-2 text-sm text-text-muted hover:text-accent-danger transition-colors"
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
