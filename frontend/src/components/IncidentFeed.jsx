import { Flame, MapPinned, ScanSearch, Siren, TimerReset } from "lucide-react";

const categoryStyles = {
  sos: "bg-rose-500/15 text-rose-100 border-rose-400/30",
  fire: "bg-amber-500/15 text-amber-100 border-amber-400/30",
  smoke: "bg-slate-300/15 text-slate-100 border-slate-300/30",
  other: "bg-sky-500/15 text-sky-100 border-sky-400/30"
};

const sourceIcon = {
  manual: Siren,
  ai: ScanSearch
};

const hasCoordinates = (incident) =>
  Number.isFinite(incident.location?.latitude) && Number.isFinite(incident.location?.longitude);

const IncidentFeed = ({ incidents, title, emptyMessage }) => (
  <section className="panel-shell p-5 sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="subtle-label">Incident stream</div>
        <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-300">Live incident stream with current response state.</p>
      </div>
      <div className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">
        {incidents.length} visible
      </div>
    </div>

    <div className="mt-5 space-y-4">
      {!incidents.length ? (
        <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-slate-950/35 px-4 py-8 text-center text-sm text-slate-400">
          {emptyMessage}
        </div>
      ) : null}

      {incidents.map((incident) => {
        const SourceIcon = sourceIcon[incident.source] || Siren;
        return (
          <article
            key={incident._id}
            className="group rounded-[1.7rem] border border-white/10 bg-slate-950/65 p-4 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-950/80"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
              <div className="flex items-start gap-3 sm:items-center">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <SourceIcon className="h-5 w-5 text-ember-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                        categoryStyles[incident.category] || categoryStyles.other
                      }`}
                    >
                      {incident.category}
                    </span>
                    <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{incident.status}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-amber-50">{incident.message}</h3>
                </div>
              </div>

              <div className="text-left text-sm text-slate-400 sm:text-right">
                <div>{new Date(incident.createdAt).toLocaleString()}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                  {incident.severity} severity
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <Flame className="h-4 w-4 text-amber-300" />
                  Source: {incident.source}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <TimerReset className="h-4 w-4 text-emerald-300" />
                  Reporter: {incident.reporterName}
                </span>
                {hasCoordinates(incident) ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                    <MapPinned className="h-4 w-4 text-sky-300" />
                    {incident.location.latitude.toFixed(4)}, {incident.location.longitude.toFixed(4)}
                  </span>
                ) : null}
              </div>

              {incident.status === "active" ? (
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-rose-200">
                  <span className="status-dot bg-rose-400" />
                  Live Alert
                </span>
              ) : (
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
                  <span className="status-dot bg-emerald-400" />
                  Resolved
                </span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

export default IncidentFeed;
