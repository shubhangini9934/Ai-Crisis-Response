import { CheckCheck, Filter, Radar, ShieldQuestion } from "lucide-react";

const AdminDashboard = ({ incidents, onResolve, resolvingId, filter, setFilter }) => (
  <section className="panel-shell p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="badge-chip border-sky-400/25 bg-sky-500/10 text-sky-200">
          <Radar className="h-4 w-4" />
          Admin Watch Desk
        </div>
        <h2 className="mt-3 text-2xl font-bold text-white">Live incident command dashboard</h2>
        <p className="mt-1 text-sm text-slate-300">
          Operators can monitor every alert and mark incidents resolved as soon as field response is complete.
        </p>
      </div>

      <div className="flex w-full items-center gap-3 sm:w-auto">
        <Filter className="h-4 w-4 text-slate-300" />
        <select
          className="min-w-0 flex-1 rounded-[1.25rem] border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-amber-400 sm:flex-none"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All incidents</option>
          <option value="active">Active only</option>
          <option value="resolved">Resolved only</option>
        </select>
      </div>
    </div>

    <div className="mt-6 space-y-4 md:hidden">
      {!incidents.length ? (
        <div className="rounded-[1.5rem] border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">
          No incidents match this filter.
        </div>
      ) : null}

      {incidents.map((incident) => (
        <article key={incident._id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
              {incident.category}
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">{incident.status}</span>
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div>
              <div className="subtle-label">Reporter</div>
              <div className="mt-1 text-white">{incident.reporterName}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="subtle-label">Severity</div>
                <div className="mt-1 capitalize text-white">{incident.severity}</div>
              </div>
              <div>
                <div className="subtle-label">Created</div>
                <div className="mt-1 text-white">{new Date(incident.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {incident.status === "active" ? (
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500/15 px-4 py-3 font-semibold text-emerald-200 transition hover:bg-emerald-500/25 disabled:opacity-60"
                onClick={() => onResolve(incident._id)}
                disabled={resolvingId === incident._id}
              >
                <CheckCheck className="h-4 w-4" />
                {resolvingId === incident._id ? "Resolving..." : "Mark Resolved"}
              </button>
            ) : (
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/5 px-4 py-3 text-slate-400">
                <ShieldQuestion className="h-4 w-4" />
                Closed
              </span>
            )}
          </div>
        </article>
      ))}
    </div>

    <div className="mt-6 hidden overflow-x-auto rounded-[1.8rem] border border-white/10 bg-slate-950/55 p-2 md:block">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.22em] text-slate-400">
            <th className="px-4 pb-2">Type</th>
            <th className="pb-2">Reporter</th>
            <th className="pb-2">Severity</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Created</th>
            <th className="px-4 pb-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {!incidents.length ? (
            <tr>
              <td colSpan="6">
                <div className="rounded-[1.5rem] border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">
                  No incidents match this filter.
                </div>
              </td>
            </tr>
          ) : null}

          {incidents.map((incident) => (
            <tr key={incident._id} className="rounded-[1.4rem] bg-slate-900/70 text-sm text-slate-200">
              <td className="rounded-l-[1.4rem] px-4 py-4 font-semibold uppercase">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-[0.2em]">
                  {incident.category}
                </span>
              </td>
              <td className="px-4 py-4">{incident.reporterName}</td>
              <td className="px-4 py-4 capitalize">{incident.severity}</td>
              <td className="px-4 py-4 capitalize">{incident.status}</td>
              <td className="px-4 py-4">{new Date(incident.createdAt).toLocaleString()}</td>
              <td className="rounded-r-[1.4rem] px-4 py-4 text-right">
                {incident.status === "active" ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 font-semibold text-emerald-200 transition hover:bg-emerald-500/25 disabled:opacity-60"
                    onClick={() => onResolve(incident._id)}
                    disabled={resolvingId === incident._id}
                  >
                    <CheckCheck className="h-4 w-4" />
                    {resolvingId === incident._id ? "Resolving..." : "Mark Resolved"}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-slate-400">
                    <ShieldQuestion className="h-4 w-4" />
                    Closed
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default AdminDashboard;
