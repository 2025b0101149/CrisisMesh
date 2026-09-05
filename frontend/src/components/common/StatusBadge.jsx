import React from 'react';

/**
 * StatusBadge Component
 * Displays system status with animated ping indicators
 */
export default function StatusBadge({ status = 'checking', label, size = 'md' }) {
  const configs = {
    connected: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
      ping: 'bg-emerald-500',
      text: label || 'Operational'
    },
    disconnected: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400',
      ping: 'bg-rose-500',
      text: label || 'Disconnected'
    },
    checking: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400',
      ping: 'bg-amber-500',
      text: label || 'Checking'
    }
  };

  const current = configs[status] || configs.checking;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-sm px-3.5 py-1 gap-2',
    lg: 'text-base px-4 py-1.5 gap-2.5'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border backdrop-blur-md transition-all duration-300 ${current.bg} ${sizeClasses[size]}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.ping}`}
        ></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}></span>
      </span>
      <span>{current.text}</span>
    </span>
  );
}
