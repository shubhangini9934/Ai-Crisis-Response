import { useState } from "react";
import { LocateFixed, Siren, TriangleAlert, ShieldPlus, Radio } from "lucide-react";

const SosPanel = ({ onTrigger, submitting, lastTrigger }) => {
  const [form, setForm] = useState({
    reporterName: "",
    message: ""
  });
  const [locationState, setLocationState] = useState("Idle");

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleTrigger = () => {
    setLocationState("Locating");

    const onLocation = (position) => {
      setLocationState("Location captured");
      onTrigger({
        ...form,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: "Browser geolocation"
        }
      });
    };

    const onLocationError = () => {
      setLocationState("Location unavailable");
      onTrigger(form);
    };

    if (!navigator.geolocation) {
      onLocationError();
      return;
    }

    navigator.geolocation.getCurrentPosition(onLocation, onLocationError, {
      enableHighAccuracy: true,
      timeout: 7000
    });
  };

  return (
    <section className="panel-shell p-5 shadow-alert sm:p-6">
      <div className="absolute -right-20 top-10 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="badge-chip border-rose-400/30 bg-rose-500/15 text-rose-100">
              <ShieldPlus className="h-4 w-4" />
              Manual distress dispatch
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">Raise an incident in one decisive action</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300 sm:leading-7">
              This control is designed for urgency: capture context, pull location when available, and fan the alert out instantly to every active operator panel.
            </p>
          </div>

          <div className="w-full rounded-[1.7rem] border border-white/10 bg-slate-950/65 px-4 py-4 text-left sm:w-auto sm:text-right">
            <div className="subtle-label">Geo capture status</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-white">
              <LocateFixed className="h-4 w-4 text-emerald-300" />
              {locationState}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/55 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <TriangleAlert className="h-4 w-4 text-rose-300" />
              Situation details
            </div>
            <div className="mt-4 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Reporter name</span>
                <input
                  className="w-full rounded-[1.35rem] border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400 focus:bg-slate-900"
                  name="reporterName"
                  placeholder="Control room, citizen, responder..."
                  value={form.reporterName}
                  onChange={updateField}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Situation note</span>
                <input
                  className="w-full rounded-[1.35rem] border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400 focus:bg-slate-900"
                  name="message"
                  placeholder="Fire on floor 2, person fainted, evacuation needed..."
                  value={form.message}
                  onChange={updateField}
                />
              </label>
            </div>
          </div>

          <div className="inset-grid rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/80 p-5">
            <div className="subtle-label">Dispatch sequence</div>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-slate-950">01</div>
                <div>
                  <div className="font-semibold text-white">Capture the alert</div>
                  <div className="mt-1 text-sm leading-6 text-slate-400">User details and location metadata are bundled into one incident payload.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-slate-950">02</div>
                <div>
                  <div className="font-semibold text-white">Broadcast live</div>
                  <div className="mt-1 text-sm leading-6 text-slate-400">Socket.IO pushes the event to active dashboards as soon as the API confirms it.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-slate-950">03</div>
                <div>
                  <div className="font-semibold text-white">Escalate the response</div>
                  <div className="mt-1 text-sm leading-6 text-slate-400">Operators can triage, resolve, and monitor the incident lifecycle from the same UI.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="relative mt-1 flex w-full items-center justify-center gap-3 overflow-hidden rounded-[1.8rem] bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 px-5 py-4 text-base font-bold text-white transition hover:scale-[1.01] hover:shadow-alert disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-5 sm:text-lg"
          type="button"
          disabled={submitting}
          onClick={handleTrigger}
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_45%)]" />
          <span className="relative flex items-center gap-3">
            <Siren className="h-6 w-6" />
            {submitting ? "Dispatching live alert..." : "Trigger SOS Alert"}
          </span>
        </button>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <Radio className="h-4 w-4 text-amber-300" />
              Broadcast behavior
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              The alert is persisted, pushed to the live feed, reflected in metrics, and eligible for push notifications when Firebase is configured.
            </p>
          </div>

          {lastTrigger ? (
            <div className="rounded-[1.5rem] border border-emerald-400/25 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100">
              <div className="subtle-label text-emerald-200/90">Latest dispatch</div>
              <div className="mt-2 leading-6">
                Incident {lastTrigger.category.toUpperCase()} created at {new Date(lastTrigger.createdAt).toLocaleTimeString()}.
              </div>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-400">
              Your most recent dispatched incident will appear here once the first alert is sent.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SosPanel;
