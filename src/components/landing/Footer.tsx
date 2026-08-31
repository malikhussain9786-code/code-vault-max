import { Github, Linkedin, Twitter } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-text-muted max-w-xs">
            A developer workspace where your code gets a real, honest AI review — not a guessing black box.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 rounded-control border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-control border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="w-9 h-9 rounded-control border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="text-sm font-semibold text-text-primary">{heading}</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-text-muted hover:text-text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-sm font-semibold text-text-primary">Contact</h4>
          <p className="mt-4 text-sm text-text-muted">hello@codevaultmax.dev</p>
        </div>
      </div>

      <div className="border-t border-border-subtle px-6 py-6 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} Code Vault Max. All rights reserved.
      </div>
    </footer>
  );
}
