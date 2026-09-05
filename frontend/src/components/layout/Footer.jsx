import React from 'react';
import { Activity, Shield, Sparkles, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-base font-bold text-white tracking-wide">CrisisMesh Project</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An intelligent, fault-tolerant platform coordinating rapid disaster response, real-time resource routing, and emergency triage with Google Gemini AI.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Incident Intake & Triage
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Geospatial Mesh Routing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Resource Allocation Matrix
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Gemini AI Dispatch Assistant
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Stack Architecture</h4>
            <div className="flex flex-wrap gap-1.5">
              {['React 19', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'JWT'].map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CrisisMesh Platform. Hackathon Scalable Foundation.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              REST API Ready
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Gemini Integrated
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
