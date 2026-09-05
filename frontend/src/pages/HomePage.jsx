import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Server, 
  RefreshCw, 
  Database, 
  Cpu, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Radio,
  Layers,
  Sparkles
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import { fetchHealthStatus } from '../services/healthService';

export default function HomePage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const performHealthCheck = async () => {
    setLoading(true);
    setErrorMsg(null);
    const result = await fetchHealthStatus();
    setLatency(result.latency);
    setLastChecked(new Date().toLocaleTimeString());

    if (result.success) {
      setHealthData(result.data);
      setErrorMsg(null);
    } else {
      setHealthData(null);
      setErrorMsg(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    performHealthCheck();
  }, []);

  const isConnected = Boolean(healthData && healthData.status === 'ok');

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Hackathon Project Foundation Active
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Emergency Response & <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">Resource Coordination</span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            CrisisMesh connects dispatch commanders, emergency responders, and affected citizens with real-time geospatial resource routing, automated triage, and Google Gemini AI coordination.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={performHealthCheck}
              loading={loading}
              icon={RefreshCw}
              variant="primary"
            >
              Ping Backend API
            </Button>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-mono">Status:</span>
              <StatusBadge
                status={loading ? 'checking' : isConnected ? 'connected' : 'disconnected'}
                label={loading ? 'Testing...' : isConnected ? 'Systems Linked' : 'Unreachable'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Health Check Diagnostics Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                <Server className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Backend Health Diagnostic (<code className="text-sm text-red-400 font-mono">GET /api/health</code>)
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Live verification between React frontend and Express server
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            {lastChecked && (
              <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Checked at: {lastChecked}
              </span>
            )}
            {latency !== null && (
              <span className={`px-3 py-1.5 rounded-lg border font-semibold ${
                latency < 100 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {latency} ms
              </span>
            )}
          </div>
        </div>

        {/* Diagnostic Status Body */}
        {errorMsg ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-300">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-rose-200">Backend Connection Error</h3>
                <p className="text-sm text-rose-300/90 leading-relaxed font-mono">
                  {errorMsg}
                </p>
                <div className="text-xs text-rose-400/80 pt-2">
                  Ensure the Express server is running on port 5000 (<code className="bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">npm run dev</code> in <code className="bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">backend/</code>).
                </div>
              </div>
            </div>
          </div>
        ) : healthData ? (
          <div className="space-y-6">
            {/* Summary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>API Status</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-emerald-400 uppercase tracking-wide">
                  {healthData.status}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">HTTP 200 OK</div>
              </div>

              <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Server Uptime</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-lg font-bold text-white font-mono">
                  {healthData.uptime}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">Active node process</div>
              </div>

              <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Database (Mongoose)</span>
                  <Database className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-bold text-slate-200 capitalize">
                  {healthData.database?.status || 'Disconnected'}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  {healthData.database?.connected ? 'Online' : 'Graceful offline fallback'}
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Environment</span>
                  <Cpu className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-purple-300 font-mono capitalize">
                  {healthData.environment}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">Port 5000</div>
              </div>
            </div>

            {/* Integration Readiness Matrix */}
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-5">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-400" />
                Integrated Services Readiness
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-medium text-slate-300">Google Gemini API</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                    healthData.integrations?.geminiAi
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {healthData.integrations?.geminiAi ? 'Key Configured' : 'Key Pending'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-slate-300">Mapbox Geospatial</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                    healthData.integrations?.mapbox
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {healthData.integrations?.mapbox ? 'Configured' : 'Token Pending'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium text-slate-300">JWT Authentication</span>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Raw JSON Payload Accordion */}
            <details className="group rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <summary className="cursor-pointer text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center justify-between select-none">
                <span>View Raw Health Check Payload (JSON)</span>
                <span className="group-open:rotate-180 transition-transform text-slate-500">▼</span>
              </summary>
              <pre className="mt-3 p-4 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-emerald-400 overflow-x-auto">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            Checking backend status...
          </div>
        )}
      </div>

      {/* Next Development Phases Grid */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white tracking-tight">CrisisMesh Core Modules</h3>
          <p className="text-sm text-slate-400 mt-1">
            The foundation is established. The following features are ready for iterative implementation:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-2">1. Emergency Incident Grid</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time incident ingestion (fires, floods, medical crises) with severity ranking and caller triage.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-2">2. Mapbox / Google Maps Mesh</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Interactive hazard maps, safe corridors, evacuation routes, and responder GPS location tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white mb-2">3. Gemini AI Dispatcher</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Multimodal emergency analysis, automatic priority scoring, and smart responder resource matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
