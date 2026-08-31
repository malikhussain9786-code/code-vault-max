import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/ui/Logo';

/**
 * Internal reference page for the design system/component library (Steps 2-3).
 * Not linked from the public nav — kept at /design-system as a living style guide
 * to check new components against as the build progresses.
 */
export function DesignSystemPreview() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-body p-8 flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Mark</CardTitle>
          <CardDescription>Full lockup and icon-only variant, both themeable</CardDescription>
        </CardHeader>
        <div className="flex items-center gap-6">
          <Logo variant="full" />
          <Logo variant="mark" />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Primary, ghost, and danger variants</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Run Code</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete Snippet</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Input</CardTitle>
          <CardDescription>With label and validation error state</CardDescription>
        </CardHeader>
        <div className="flex flex-col gap-4 max-w-sm">
          <Input label="Snippet title" placeholder="e.g. Debounce hook" />
          <Input label="Email" defaultValue="not-an-email" error="Enter a valid email address" />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Language tags and status indicators</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          <Badge>TypeScript</Badge>
          <Badge tone="success">Completed</Badge>
          <Badge tone="warning">In Review</Badge>
          <Badge tone="danger">Failing</Badge>
        </div>
      </Card>

      <p className="font-mono text-sm text-text-muted">JetBrains Mono — used in the code editor and history logs</p>
    </div>
  );
}
