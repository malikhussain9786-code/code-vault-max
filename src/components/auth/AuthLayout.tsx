import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Card } from '@/components/ui/Card';

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-body flex flex-col items-center justify-center px-6 py-12">
      <Link to="/" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="font-display font-semibold text-2xl tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-text-muted">{subtitle}</p>
        </div>
        <Card>{children}</Card>
      </div>
    </div>
  );
}
