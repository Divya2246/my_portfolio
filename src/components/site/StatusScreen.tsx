import type { ReactNode } from 'react';
import { ThemeToggle } from './ui';

export default function StatusScreen({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-5 py-24">
      <div className="fixed z-40" style={{ top: 'calc(1rem + env(safe-area-inset-top))', right: '1rem' }}>
        <ThemeToggle />
      </div>
      <div role="status" className="panel relative w-full max-w-md p-8 md:p-10">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {body ? <p className="mt-3 text-base leading-relaxed text-muted">{body}</p> : null}
        <div className="mt-8 h-px w-16 bg-accent" aria-hidden="true" />
        {action}
      </div>
    </div>
  );
}
