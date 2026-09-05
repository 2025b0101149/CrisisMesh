import React from 'react';

/**
 * MetricCard Component
 * Displays critical incident & resource KPIs with accessible typography and clean indicators
 */
export default function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  variant = 'default',
  trend = null,
  onClick
}) {
  const variants = {
    default: 'bg-slate-900/70 border-slate-800 text-slate-100',
    critical: 'bg-red-950/20 border-red-500/40 text-red-100 shadow-lg shadow-red-500/10',
    warning: 'bg-amber-950/20 border-amber-500/30 text-amber-100',
    success: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100',
    info: 'bg-cyan-950/20 border-cyan-500/30 text-cyan-100'
  };

  const iconColors = {
    default: 'text-slate-400 bg-slate-800/80 border-slate-700',
    critical: 'text-red-400 bg-red-500/15 border-red-500/30',
    warning: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    success: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    info: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30'
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-5 backdrop-blur-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-600 active:scale-[0.99]' : ''
      } ${variants[variant] || variants.default}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-white font-mono">
              {value}
            </span>
            {trend && (
              <span className="text-xs font-semibold text-emerald-400 font-mono">
                {trend}
              </span>
            )}
          </div>
          {subtext && (
            <p className="text-xs text-slate-400/90 pt-1 font-sans">
              {subtext}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl border shrink-0 ${iconColors[variant] || iconColors.default}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
