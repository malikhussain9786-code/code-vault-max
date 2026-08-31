import { useState, useEffect, type FormEvent } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function ProfileSection() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateProfile({ name, bio });
    setMessage('Profile updated');
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your name and bio.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio" />
        {message && <p className="text-sm text-accent-secondary">{message}</p>}
        <Button type="submit" className="w-fit">
          Save changes
        </Button>
      </form>
    </Card>
  );
}

function SecuritySection() {
  const changePassword = useAuthStore((s) => s.changePassword);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await changePassword(currentPassword, newPassword);
      setMessage('Password updated successfully');
      setIsError(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
      setIsError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Change your password.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <Input
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
        />
        {message && <p className={`text-sm ${isError ? 'text-accent-danger' : 'text-accent-secondary'}`}>{message}</p>}
        <Button type="submit" disabled={saving} className="w-fit">
          {saving ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </Card>
  );
}

function ThemeSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>Switch between dark and light mode.</CardDescription>
      </CardHeader>
      <ThemeToggle />
    </Card>
  );
}

function AiStatusSection() {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    apiClient
      .get('/api/ai/status')
      .then((res) => setAvailable(res.data.available))
      .catch(() => setAvailable(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI features</CardTitle>
        <CardDescription>Powered by Groq, configured via the deployment's environment variables.</CardDescription>
      </CardHeader>
      {available === null ? (
        <p className="text-sm text-text-muted">Checking…</p>
      ) : available ? (
        <p className="text-sm text-accent-secondary">AI features are active.</p>
      ) : (
        <p className="text-sm text-text-muted">
          AI features aren't configured yet. The editor, snippets, and projects all work fully without them.
        </p>
      )}
    </Card>
  );
}

export function SettingsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="font-display font-bold text-2xl tracking-tight">Settings</h1>
      <p className="text-text-muted mt-1 text-sm">Manage your account and preferences.</p>

      <div className="mt-6 flex flex-col gap-5">
        <ProfileSection />
        <SecuritySection />
        <ThemeSection />
        <AiStatusSection />
      </div>
    </div>
  );
}
