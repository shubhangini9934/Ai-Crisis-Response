import { ExternalLink, MapPinned, Navigation } from "lucide-react";

const LocationPanel = ({ incidents }) => {
  const locatedIncidents = incidents.filter(
    (incident) =>
      Number.isFinite(incident.location?.latitude) && Number.isFinite(incident.location?.longitude)
  );
  const focus = locatedIncidents[0];

  const buildMapsLink = (incident) =>
    `https://www.google.com/maps?q=${incident.location.latitude},${incident.location.longitude}`;

  return (
    <section className="panel-shell p-5 sm:p-6">
      <div className="flex items-start gap-3 sm:items-center">
        <div className="rounded-2xl border border-sky-300/20 bg-sky-500/10 p-3">
          <MapPinned className="h-5 w-5 text-sky-300" />
        </div>
        <div>
          <div className="subtle-label">Location intelligence</div>
          <h2 className="mt-2 text-2xl font-bold text-white">Location Snapshot</h2>
          <p className="mt-1 text-sm text-slate-300">Quick coordinates for the most recent incidents with location metadata.</p>
        </div>
      </div>

      {!focus ? (
        <div className="mt-5 rounded-[1.7rem] border border-dashed border-white/10 bg-slate-950/35 px-4 py-8 text-center text-sm text-slate-400">
          No incident coordinates available yet. Browser geolocation will populate this panel automatically.
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="rounded-[2rem] border border-sky-300/20 bg-gradient-to-br from-sky-500/15 via-slate-950/80 to-slate-900/95 p-5">
            <div className="subtle-label text-sky-100/80">Primary Incident</div>
            <h3 className="mt-3 text-xl font-semibold text-white">{focus.message}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="subtle-label">Latitude</div>
                <div className="mt-2 text-lg font-semibold text-white">{focus.location.latitude.toFixed(6)}</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="subtle-label">Longitude</div>
                <div className="mt-2 text-lg font-semibold text-white">{focus.location.longitude.toFixed(6)}</div>
              </div>
            </div>
            <a
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-500/30 sm:w-auto"
              href={buildMapsLink(focus)}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation className="h-4 w-4" />
              Open in Maps
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="space-y-3">
            {locatedIncidents.slice(0, 3).map((incident) => (
              <div key={incident._id} className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">{incident.category.toUpperCase()}</div>
                    <div className="mt-1 text-sm text-slate-300">
                      {incident.location.latitude.toFixed(4)}, {incident.location.longitude.toFixed(4)}
                    </div>
                  </div>
                  <a className="text-sm font-semibold text-sky-300" href={buildMapsLink(incident)} target="_blank" rel="noreferrer">
                    Inspect
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default LocationPanel;
