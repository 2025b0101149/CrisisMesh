import React from 'react';

/**
 * Priority and Status Badges for Emergency Response
 */
export default function PriorityBadge({ priority = 'MEDIUM', size = 'sm' }) {
  const p = priority.toUpperCase();

  const styles = {
    CRITICAL: {
      wrap: 'bg-red-500/15 text-red-400 border-red-500/40 font-bold',
      dot: 'bg-red-500',
      ping: 'bg-red-500',
      label: 'CRITICAL'
    },
    HIGH: {
      wrap: 'bg-amber-500/15 text-amber-400 border-amber-500/40 font-semibold',
      dot: 'bg-amber-400',
      ping: 'bg-amber-400',
      label: 'HIGH'
    },
    MEDIUM: {
      wrap: 'bg-sky-500/15 text-sky-400 border-sky-500/30 font-medium',
      dot: 'bg-sky-400',
      ping: null,
      label: 'MEDIUM'
    },
    LOW: {
      wrap: 'bg-slate-800/80 text-slate-300 border-slate-700 font-normal',
      dot: 'bg-slate-400',
      ping: null,
      label: 'LOW'
    }
  };

  const current = styles[p] || styles.MEDIUM;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-sm tracking-wide uppercase transition-all ${current.wrap} ${sizeClasses[size]}`}
    >
      <span className="relative flex h-2 w-2">
        {current.ping && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.ping}`}
          ></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}></span>
      </span>
      <span>{current.label}</span>
    </span>
  );
}

export function StatusPill({ status = 'Active', size = 'sm' }) {
  const s = status.toLowerCase();

  const styles = {
    active: 'bg-red-500/10 text-red-400 border-red-500/20',
    dispatched: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'in progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  const style = styles[s] || styles.active;

  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5'
  };

  return (
    <span className={`inline-flex items-center rounded-lg border font-mono font-medium ${style} ${sizeClasses[size]}`}>
      {status}
    </span>
  );
}
