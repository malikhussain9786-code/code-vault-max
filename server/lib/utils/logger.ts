// Lightweight structured logging — Vercel automatically captures console output into
// its own function logs dashboard, so a full logging library (winston, etc.) isn't
// needed here the way it was for the traditional always-running server. Structured
// JSON output is kept so logs remain machine-parseable if ever shipped elsewhere.

function log(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) {
  const entry = { level, message, service: 'code-vault-pro', timestamp: new Date().toISOString(), ...meta };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
};
