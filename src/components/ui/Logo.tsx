interface LogoProps {
  /** 'full' shows icon + wordmark (nav bar, landing header). 'mark' is icon-only (collapsed sidebar, mobile). */
  variant?: 'full' | 'mark';
  className?: string;
}

/**
 * Rendered as inline SVG rather than an <img> so the wordmark uses `currentColor`
 * and automatically follows the active theme (dark/light) without a separate asset per theme.
 */
export function Logo({ variant = 'full', className }: LogoProps) {
  const mark = (
    <g>
      <circle cx="18" cy="18" r="17" fill="none" stroke="url(#logo-gradient)" strokeWidth="2.5" />
      <path
        d="M13 12 L7 18 L13 24"
        fill="none"
        stroke="url(#logo-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 12 L29 18 L23 24"
        fill="none"
        stroke="url(#logo-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="18" r="2" fill="url(#logo-gradient)" />
    </g>
  );

  if (variant === 'mark') {
    return (
      <svg width="32" height="32" viewBox="0 0 36 36" className={className} role="img" aria-label="Code Vault Max">
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C5CFF" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <g transform="translate(0,0)">{mark}</g>
      </svg>
    );
  }

  return (
    <svg width="200" height="36" viewBox="0 0 220 40" className={className} role="img" aria-label="Code Vault Max">
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <g transform="translate(2,2)">{mark}</g>
      <text
        x="50"
        y="26"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight="600"
        fontSize="19"
        fill="currentColor"
        letterSpacing="-0.3"
      >
        Code Vault<tspan fill="url(#logo-gradient)"> Max</tspan>
      </text>
    </svg>
  );
}
