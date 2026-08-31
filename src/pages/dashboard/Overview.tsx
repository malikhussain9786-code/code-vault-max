import { useMemo } from 'react';
import { Code2, FolderGit2, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { useSnippets } from '@/hooks/useSnippets';
import { useProjects } from '@/hooks/useProjects';

const ACTIVITY_WINDOW_DAYS = 14;

/** All stats computed directly from localStorage-backed data — instant, no network, no loading state needed. */
export function Overview() {
  const { snippets, loading: snippetsLoading } = useSnippets();
  const { projects, loading: projectsLoading } = useProjects();

  const loading = snippetsLoading || projectsLoading;

  const snippetsThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return snippets.filter((s) => new Date(s.created_at).getTime() > weekAgo).length;
  }, [snippets]);

  const languageUsage = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of snippets) counts.set(s.language, (counts.get(s.language) ?? 0) + 1);
    return [...counts.entries()]
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [snippets]);

  const activityByDay = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of snippets) {
      const key = s.created_at.slice(0, 10);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const days: { date: string; count: number }[] = [];
    for (let i = ACTIVITY_WINDOW_DAYS - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, count: counts.get(key) ?? 0 });
    }
    return days;
  }, [snippets]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-8 w-16 bg-bg-elevated rounded" />
              <div className="h-3 w-24 bg-bg-elevated rounded mt-3" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Code2, label: 'Snippets saved', value: snippets.length },
    { icon: FolderGit2, label: 'Projects', value: projects.length },
    { icon: TrendingUp, label: 'Snippets this week', value: snippetsThisWeek },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display font-bold text-2xl tracking-tight">Overview</h1>
      <p className="text-text-muted mt-1 text-sm">A snapshot of your workspace.</p>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-display font-semibold">{stat.value}</p>
              <p className="text-xs text-text-muted mt-1">{stat.label}</p>
            </div>
            <div className="w-9 h-9 rounded-control bg-bg-elevated flex items-center justify-center">
              <stat.icon size={16} className="text-accent-primary" />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <ActivityChart data={activityByDay} />
      </div>

      <Card className="mt-6">
        <h2 className="font-display font-semibold text-sm">Language usage</h2>
        {languageUsage.length === 0 ? (
          <p className="text-sm text-text-muted mt-3">
            No snippets yet — once you save your first one, its language will show up here.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {languageUsage.map((lang) => (
              <div key={lang.language} className="flex items-center gap-3">
                <span className="text-sm w-24 shrink-0 text-text-primary">{lang.language}</span>
                <div className="flex-1 h-2 rounded-full bg-bg-elevated overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                    style={{ width: `${(lang.count / snippets.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted w-6 text-right">{lang.count}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
