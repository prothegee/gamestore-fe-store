'use client';

export function EnvBanner() {
  const env = process.env.NEXT_PUBLIC_APP_ENV;

  if (!env || env === 'production') {
    return null;
  }

  const isDebug = env === 'debug';
  const colorClass = isDebug ? 'bg-orange-600' : 'bg-blue-600';
  const label = isDebug ? 'DEBUG' : 'STAGING';

  return (
    <div className={`fixed bottom-4 right-4 ${colorClass} text-white px-3 py-1 text-[10px] font-bold tracking-widest rounded shadow-2xl z-9999 pointer-events-none select-none uppercase border border-white/20 opacity-80`}>
      {label}
    </div>
  );
}
