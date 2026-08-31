import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card } from '@/components/ui/Card';

interface ActivityPoint {
  date: string;
  count: number;
}

export function ActivityChart({ data }: { data: ActivityPoint[] }) {
  const hasAnyActivity = data.some((d) => d.count > 0);

  return (
    <Card>
      <h2 className="font-display font-semibold text-sm">Snippet activity — last 14 days</h2>

      {!hasAnyActivity ? (
        <p className="text-sm text-text-muted mt-3">
          No snippets saved yet in the last 14 days — this fills in as you save code.
        </p>
      ) : (
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => d.slice(5)}
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={{ stroke: 'var(--border-subtle)' }}
                tickLine={false}
                interval={2}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(d: string) => d}
              />
              <Line type="monotone" dataKey="count" stroke="#7C5CFF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
