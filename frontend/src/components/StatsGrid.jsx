import { Flame, ShieldAlert, Siren, TimerReset } from "lucide-react";

const cards = [
  {
    key: "active",
    label: "Active Incidents",
    icon: ShieldAlert,
    accent: "text-rose-300",
    ring: "from-rose-500/20 to-transparent"
  },
  {
    key: "critical",
    label: "Critical Open Alerts",
    icon: Flame,
    accent: "text-amber-300",
    ring: "from-amber-500/20 to-transparent"
  },
  {
    key: "resolved",
    label: "Resolved Cases",
    icon: TimerReset,
    accent: "text-emerald-300",
    ring: "from-emerald-500/20 to-transparent"
  },
  {
    key: "total",
    label: "Total Recorded",
    icon: Siren,
    accent: "text-sky-300",
    ring: "from-sky-500/20 to-transparent"
  }
];

const StatsGrid = ({ summary }) => (
  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {cards.map(({ key, label, icon: Icon, accent, ring }) => (
      <article key={key} className="metric-card">
        <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${ring}`} />
        <div className="relative flex items-center justify-between">
          <span className="subtle-label">{label}</span>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <Icon className={`h-5 w-5 ${accent}`} />
          </div>
        </div>
        <div className="relative mt-6 flex items-end justify-between gap-4">
          <div className="text-4xl font-bold text-white">{summary[key] ?? 0}</div>
          <div className="text-sm text-slate-400">live snapshot</div>
        </div>
      </article>
    ))}
  </section>
);

export default StatsGrid;
