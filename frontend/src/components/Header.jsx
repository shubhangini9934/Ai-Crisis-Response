import { Activity, BellRing, ShieldCheck, Sparkles, Siren, Waves } from "lucide-react";

const Header = ({ connected }) => (
  <header className="panel-shell">
    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
    <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl" />
    <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />

    <div className="relative grid gap-8 px-5 py-6 sm:px-6 sm:py-7 lg:grid-cols-[1.25fr_0.75fr] lg:px-8 lg:py-8">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <div className="badge-chip border-amber-400/30 bg-amber-500/10 text-amber-100">
            <ShieldCheck className="h-4 w-4" />
            Emergency Operations
          </div>
          <div className="badge-chip border-sky-400/25 bg-sky-500/10 text-sky-100">
            <Sparkles className="h-4 w-4" />
            AI-assisted response
          </div>
        </div>

        <div className="max-w-4xl">
          <h1 className="text-balance text-3xl font-bold leading-[1.05] text-white sm:text-4xl md:text-6xl">
            Command-center visibility for critical incidents the moment they happen.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
            Blend human SOS dispatch with live AI fire and smoke detection, then route every event through one real-time incident stream built for response teams.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/55 p-4">
            <div className="subtle-label">Mission Priority</div>
            <div className="mt-3 flex items-center gap-3 text-white">
              <div className="rounded-2xl bg-rose-500/15 p-2">
                <Siren className="h-5 w-5 text-rose-300" />
              </div>
              <div>
                <div className="text-lg font-semibold">Rapid dispatch</div>
                <div className="text-sm text-slate-400">Manual + automated alerts</div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/55 p-4">
            <div className="subtle-label">Signal Path</div>
            <div className="mt-3 flex items-center gap-3 text-white">
              <div className="rounded-2xl bg-emerald-500/15 p-2">
                <Waves className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <div className="text-lg font-semibold">Live socket sync</div>
                <div className="text-sm text-slate-400">Dashboards update instantly</div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/55 p-4">
            <div className="subtle-label">Notification Path</div>
            <div className="mt-3 flex items-center gap-3 text-white">
              <div className="rounded-2xl bg-sky-500/15 p-2">
                <BellRing className="h-5 w-5 text-sky-300" />
              </div>
              <div>
                <div className="text-lg font-semibold">Push ready</div>
                <div className="text-sm text-slate-400">Firebase fallback + in-app alerts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="animate-float rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.45)]">
          <div className="flex items-center justify-between">
            <div className="subtle-label">Network telemetry</div>
            <Activity className="h-5 w-5 text-emerald-300" />
          </div>
          <div className="mt-5 flex items-start gap-3 sm:items-center">
            <span className={`status-dot animate-pulse-soft ${connected ? "bg-emerald-400" : "bg-rose-400"}`} />
            <div>
              <div className="text-lg font-semibold text-white sm:text-xl">
                {connected ? "Socket channel online" : "Reconnecting to alert channel"}
              </div>
              <div className="mt-1 text-sm text-slate-400">
                Incident broadcasts, summary counters, and operator views stay synchronized from this stream.
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-emerald-400/15 bg-emerald-500/5 p-4">
            <div className="subtle-label text-emerald-200/80">Operational note</div>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              Manual SOS events and AI detections enter the same response pipeline, which makes triage and escalation much easier for a small team.
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
