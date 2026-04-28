import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Flame,
  HeartPulse,
  Hotel,
  LifeBuoy,
  MapPinned,
  Radar,
  Route,
  ShieldAlert,
  ShieldCheck,
  Siren,
  TriangleAlert,
  UserRoundCheck,
  Users
} from "lucide-react";

const staffRoster = ["North Wing Team", "Medical Unit", "Security Lead", "Floor Marshal"];

const roleTabs = {
  guest: [
    { id: "guest", label: "Guest Dashboard", icon: LifeBuoy },
    { id: "ai", label: "AI Detection", icon: Bot },
    { id: "evacuation", label: "Evacuation", icon: Route }
  ],
  admin: [
    { id: "admin", label: "Admin Dashboard", icon: ShieldAlert },
    { id: "ai", label: "AI Detection", icon: Bot },
    { id: "evacuation", label: "Evacuation", icon: Route }
  ],
  staff: [
    { id: "staff", label: "Staff Panel", icon: UserRoundCheck },
    { id: "ai", label: "AI Detection", icon: Bot },
    { id: "evacuation", label: "Evacuation", icon: Route }
  ]
};

const emergencyMeta = {
  Fire: {
    icon: Flame,
    tone: "bg-red-50 text-red-600 ring-red-200",
    banner: "from-red-600 via-red-500 to-orange-400"
  },
  Medical: {
    icon: HeartPulse,
    tone: "bg-blue-50 text-blue-600 ring-blue-200",
    banner: "from-blue-600 via-sky-500 to-cyan-400"
  },
  Security: {
    icon: ShieldAlert,
    tone: "bg-slate-100 text-slate-700 ring-slate-200",
    banner: "from-slate-700 via-slate-600 to-slate-500"
  }
};

const initialIncidents = [
  {
    id: "INC-2401",
    type: "Medical",
    location: "Hotel Tower B, Floor 6",
    timestamp: isoMinutesAgo(12),
    status: "Active",
    source: "Manual SOS",
    assignedStaff: "Medical Unit",
    responseState: "In Progress"
  },
  {
    id: "INC-2402",
    type: "Security",
    location: "Campus Gate 2",
    timestamp: isoMinutesAgo(28),
    status: "Resolved",
    source: "AI Patrol Camera",
    assignedStaff: "Security Lead",
    responseState: "Resolved"
  },
  {
    id: "INC-2403",
    type: "Fire",
    location: "Conference Hall, West Wing",
    timestamp: isoMinutesAgo(4),
    status: "Active",
    source: "Thermal Sensor",
    assignedStaff: "",
    responseState: "Pending"
  }
];

function App() {
  const [screen, setScreen] = useState("landing");
  const [role, setRole] = useState("guest");
  const [activeTab, setActiveTab] = useState("guest");
  const [email, setEmail] = useState("guest@grandplaza.com");
  const [password, setPassword] = useState("");
  const [guestLocation, setGuestLocation] = useState("Room 614, Floor 6");
  const [selectedEmergency, setSelectedEmergency] = useState("Fire");
  const [lastConfirmation, setLastConfirmation] = useState("");
  const [incidents, setIncidents] = useState(initialIncidents);
  const [alerts, setAlerts] = useState([]);
  const [aiStatus, setAiStatus] = useState({
    state: "safe",
    headline: "No threat detected",
    detail: "Thermal, smoke, and occupancy streams are stable across all monitored zones."
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeCount = incidents.filter((incident) => incident.status === "Active").length;
  const resolvedCount = incidents.filter((incident) => incident.status === "Resolved").length;
  const assignedCount = incidents.filter((incident) => incident.assignedStaff).length;

  const enqueueAlert = (title, message, tone = "critical") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setAlerts((current) => [{ id, title, message, tone }, ...current].slice(0, 4));
    window.setTimeout(() => {
      setAlerts((current) => current.filter((alert) => alert.id !== id));
    }, 5000);
  };

  const createIncident = ({ type, location, source }) => {
    const incident = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      type,
      location,
      timestamp: new Date().toISOString(),
      status: "Active",
      source,
      assignedStaff: "",
      responseState: "Pending"
    };

    setIncidents((current) => [incident, ...current]);
    enqueueAlert(`${type} alert`, `${location} reported through ${source}.`);
    return incident;
  };

  const handleGetStarted = () => {
    setScreen("login");
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setScreen("app");
    setActiveTab(role);
  };

  const handleLogout = () => {
    setScreen("landing");
    setPassword("");
    setLastConfirmation("");
    setActiveTab("guest");
  };

  const handleSos = () => {
    createIncident({
      type: selectedEmergency,
      location: guestLocation,
      source: "Manual SOS"
    });
    setLastConfirmation("Emergency alert sent. Help is on the way.");
    setActiveTab("guest");
  };

  const handleAssignStaff = (incidentId, staffName) => {
    setIncidents((current) =>
      current.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              assignedStaff: staffName,
              responseState: staffName ? "Assigned" : "Pending"
            }
          : incident
      )
    );

    if (staffName) {
      enqueueAlert("Staff assigned", `${staffName} has been assigned to ${incidentId}.`, "info");
    }
  };

  const handleResolveIncident = (incidentId) => {
    setIncidents((current) =>
      current.map((incident) =>
        incident.id === incidentId
          ? { ...incident, status: "Resolved", responseState: "Resolved" }
          : incident
      )
    );
    enqueueAlert("Incident resolved", `${incidentId} has been marked resolved.`, "success");
  };

  const handleStaffDecision = (incidentId, decision) => {
    setIncidents((current) =>
      current.map((incident) => {
        if (incident.id !== incidentId) {
          return incident;
        }

        if (decision === "Accept") {
          return { ...incident, responseState: "In Progress" };
        }

        return { ...incident, assignedStaff: "", responseState: "Pending" };
      })
    );

    enqueueAlert(
      decision === "Accept" ? "Task accepted" : "Task returned",
      `${incidentId} was ${decision === "Accept" ? "accepted by staff." : "returned for reassignment."}`,
      decision === "Accept" ? "info" : "critical"
    );
  };

  const handleStaffStatus = (incidentId, status) => {
    setIncidents((current) =>
      current.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              responseState: status,
              status: status === "Resolved" ? "Resolved" : incident.status
            }
          : incident
      )
    );

    enqueueAlert("Status updated", `${incidentId} is now ${status}.`, status === "Resolved" ? "success" : "info");
  };

  const simulateAiDetection = () => {
    setAiStatus({
      state: "danger",
      headline: "Fire detected",
      detail: "Camera 04 flagged heat bloom and smoke in the West Wing corridor."
    });

    createIncident({
      type: "Fire",
      location: "West Wing Corridor, Camera 04",
      source: "AI Detection"
    });
    setActiveTab("ai");
  };

  const resetAiStatus = () => {
    setAiStatus({
      state: "safe",
      headline: "No threat detected",
      detail: "Thermal, smoke, and occupancy streams are stable across all monitored zones."
    });
  };

  const tabs = roleTabs[role];

  return (
    <div className="app-shell min-h-screen overflow-x-hidden text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0))]" />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full border border-blue-100/70 bg-blue-100/30 blur-3xl" />
        <div className="absolute right-0 top-28 h-80 w-80 rounded-full border border-red-100/70 bg-red-100/35 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(180deg,rgba(15,23,42,0.32),transparent_78%)]" />
      </div>
      <AlertStack alerts={alerts} />

      {screen === "landing" ? <LandingPage onGetStarted={handleGetStarted} /> : null}

      {screen === "login" ? (
        <LoginPage
          email={email}
          password={password}
          role={role}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onRoleChange={setRole}
          onBack={() => setScreen("landing")}
          onSubmit={handleLogin}
        />
      ) : null}

      {screen === "app" ? (
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <TopBar
            role={role}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
            currentTime={currentTime}
            activeCount={activeCount}
            onLogout={handleLogout}
          />

          {activeCount > 0 ? (
            <div className="alert-banner mt-5">
              <div className="flex items-center gap-3">
                <Siren className="h-5 w-5" />
                <div>
                  <div className="text-sm font-semibold text-white">Active emergency workflow in progress</div>
                  <div className="text-xs text-red-100">
                    {activeCount} live incident{activeCount > 1 ? "s" : ""} being tracked across guest, staff, and command views.
                  </div>
                </div>
              </div>
              <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                Urgent
              </div>
            </div>
          ) : null}

          <SummaryRow
            activeCount={activeCount}
            resolvedCount={resolvedCount}
            assignedCount={assignedCount}
            aiState={aiStatus.state}
          />

          <div className="mt-6 grid gap-6">
            {activeTab === "guest" ? (
              <GuestDashboard
                guestLocation={guestLocation}
                setGuestLocation={setGuestLocation}
                selectedEmergency={selectedEmergency}
                setSelectedEmergency={setSelectedEmergency}
                onSos={handleSos}
                lastConfirmation={lastConfirmation}
                incidents={incidents}
              />
            ) : null}

            {activeTab === "admin" ? (
              <AdminDashboard
                incidents={incidents}
                onAssignStaff={handleAssignStaff}
                onResolveIncident={handleResolveIncident}
              />
            ) : null}

            {activeTab === "staff" ? (
              <StaffPanel
                incidents={incidents.filter((incident) => incident.status === "Active")}
                onDecision={handleStaffDecision}
                onStatusChange={handleStaffStatus}
              />
            ) : null}

            {activeTab === "ai" ? (
              <AIDetectionPanel
                aiStatus={aiStatus}
                onSimulate={simulateAiDetection}
                onReset={resetAiStatus}
                incidents={incidents}
              />
            ) : null}

            {activeTab === "evacuation" ? <EvacuationScreen incidents={incidents} /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LandingPage({ onGetStarted }) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-[0_16px_45px_rgba(220,38,38,0.28)]">
            <Siren className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">Crisis Command</div>
            <div className="text-lg font-semibold text-slate-900">AI Crisis Response System</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </button>
      </header>

      <main className="flex flex-1 flex-col justify-center">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-red-600 shadow-sm">
              <TriangleAlert className="h-4 w-4" />
              Emergency intelligence for large facilities
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.02] text-balance text-slate-950 sm:text-6xl">
              AI Crisis Response System
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              A realistic command prototype for hotels, campuses, and large venues that brings together SOS reporting,
              AI-triggered detection, live incident management, and guided evacuation support in one interface.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(220,38,38,0.28)] transition hover:bg-red-500"
              >
                Enter Platform
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm">
                <Radar className="h-4 w-4 text-blue-600" />
                Live incident simulation ready
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <LandingMetric label="Response window" value="< 15 sec" detail="From detection to visible command alert." accent="red" />
              <LandingMetric label="Facility coverage" value="48 feeds" detail="Guests, staff, AI, and exits share one view." accent="blue" />
              <LandingMetric label="Evacuation routes" value="12 paths" detail="Safe guidance updates from the active incident." accent="blue" />
            </div>
          </div>

          <LandingCommandStage />
        </section>

        <section className="grid gap-5 pb-10 md:grid-cols-3">
          <InfoBand
            icon={Bell}
            title="Real-time alerts"
            text="New emergencies pulse across the interface with visual urgency and status-aware notifications."
          />
          <InfoBand
            icon={Bot}
            title="AI-based detection"
            text="The AI panel simulates fire detection from camera streams and feeds incidents directly into operations."
          />
          <InfoBand
            icon={MapPinned}
            title="Smart evacuation guidance"
            text="A clean route screen highlights the closest exit and keeps evacuation instructions simple and immediate."
          />
        </section>
      </main>
    </div>
  );
}

function LandingCommandStage() {
  return (
    <div className="panel-surface overflow-hidden p-5 sm:p-6">
      <div className="rounded-[30px] bg-[linear-gradient(140deg,#0f172a_0%,#1e3a8a_42%,#dc2626_100%)] p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">Command Snapshot</div>
            <div className="mt-2 text-2xl font-semibold">Unified emergency workflow</div>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <Siren className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <MetricMini label="Open incidents" value="03" />
          <MetricMini label="AI feeds" value="12" />
          <MetricMini label="Dispatch teams" value="08" />
          <MetricMini label="Evacuation mode" value="Ready" />
        </div>

        <div className="mt-6 grid gap-4">
          <SnapshotRow icon={TriangleAlert} label="Emergency trigger" value="Guest SOS from Room 614 escalates to active incident card instantly." />
          <SnapshotRow icon={Bot} label="AI detection" value="Camera 04 flags a fire signature and pushes it to the same live queue." />
          <SnapshotRow icon={Route} label="Evacuation guidance" value="Safe path highlights nearest exit and updates on the route screen." />
        </div>
      </div>
    </div>
  );
}

function LoginPage({
  email,
  password,
  role,
  onEmailChange,
  onPasswordChange,
  onRoleChange,
  onBack,
  onSubmit
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back
          </button>

          <div className="panel-surface p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
              Secure Access
            </div>
            <h2 className="mt-5 text-3xl font-semibold text-slate-950">Sign in to your response console</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Choose the role you want to simulate, then enter the platform to review alerts, trigger incidents, and
              coordinate response actions.
            </p>

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <Field label="Email">
                <input
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  type="email"
                  className="input-shell"
                  placeholder="name@facility.com"
                  required
                />
              </Field>

              <Field label="Password">
                <input
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  type="password"
                  className="input-shell"
                  placeholder="Enter password"
                  required
                />
              </Field>

              <div>
                <div className="mb-3 text-sm font-semibold text-slate-700">Role</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { id: "guest", label: "Guest", icon: Hotel },
                    { id: "staff", label: "Staff", icon: UserRoundCheck },
                    { id: "admin", label: "Admin", icon: ShieldCheck }
                  ].map((option) => {
                    const Icon = option.icon;
                    const selected = role === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => onRoleChange(option.id)}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          selected
                            ? "border-red-300 bg-red-50 shadow-[0_16px_40px_rgba(220,38,38,0.12)]"
                            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${selected ? "text-red-600" : "text-blue-600"}`} />
                        <div className="mt-3 text-sm font-semibold text-slate-900">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(220,38,38,0.24)] transition hover:bg-red-500"
              >
                Enter Dashboard
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="panel-surface flex items-center p-6 sm:p-8">
          <div className="grid gap-4">
            <FeatureTile
              icon={Siren}
              title="Guest SOS flow"
              text="A large single-action emergency control makes it easy to ask for help without searching through clutter."
              accent="red"
            />
            <FeatureTile
              icon={Users}
              title="Role-aware operations"
              text="Guests report incidents, staff execute assignments, and admins control triage and resolution."
              accent="blue"
            />
            <FeatureTile
              icon={Bot}
              title="AI signal simulation"
              text="The AI view mirrors how camera detections can surface threats before a human report arrives."
              accent="blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar({ role, activeTab, setActiveTab, tabs, currentTime, activeCount, onLogout }) {
  return (
    <div className="panel-surface p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-[0_16px_45px_rgba(220,38,38,0.24)]">
            <Siren className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">AI Crisis Response System</div>
            <div className="mt-1 text-xl font-semibold text-slate-950">
              {role === "guest" ? "Guest response dashboard" : role === "admin" ? "Admin command center" : "Staff action panel"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Clock3 className="mr-2 inline h-4 w-4" />
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600">
            {activeCount} active alert{activeCount !== 1 ? "s" : ""}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const selected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                selected
                  ? "bg-red-600 text-white shadow-[0_16px_35px_rgba(220,38,38,0.22)]"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SummaryRow({ activeCount, resolvedCount, assignedCount, aiState }) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Active emergencies" value={activeCount} accent="red" />
      <StatCard label="Resolved incidents" value={resolvedCount} accent="blue" />
      <StatCard label="Assigned teams" value={assignedCount} accent="blue" />
      <StatCard label="AI feed status" value={aiState === "danger" ? "Alert" : "Clear"} accent={aiState === "danger" ? "red" : "blue"} />
    </div>
  );
}

function GuestDashboard({
  guestLocation,
  setGuestLocation,
  selectedEmergency,
  setSelectedEmergency,
  onSos,
  lastConfirmation,
  incidents
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <SectionCard
        title="Guest Emergency Control"
        description="This view is optimized for speed and clarity so a guest can trigger help in a few seconds during a stressful moment."
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <Field label="Current location">
              <input
                value={guestLocation}
                onChange={(event) => setGuestLocation(event.target.value)}
                className="input-shell"
                placeholder="Room 614, Floor 6"
              />
            </Field>

            <div>
              <div className="mb-3 text-sm font-semibold text-slate-700">Emergency type</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {Object.keys(emergencyMeta).map((type) => {
                  const meta = emergencyMeta[type];
                  const Icon = meta.icon;
                  const selected = selectedEmergency === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedEmergency(type)}
                      className={`rounded-[24px] border px-4 py-4 text-left transition ${
                        selected
                          ? "border-red-300 bg-red-50 shadow-[0_16px_36px_rgba(220,38,38,0.12)]"
                          : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${selected ? "text-red-600" : "text-blue-600"}`} />
                      <div className="mt-3 text-sm font-semibold text-slate-900">{type}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-[32px] border border-red-100 bg-[radial-gradient(circle_at_top,rgba(254,226,226,0.95),rgba(255,255,255,0.85))] px-5 py-6">
            <button
              type="button"
              onClick={onSos}
              className="sos-ring flex h-52 w-52 items-center justify-center rounded-full bg-red-600 text-center text-2xl font-semibold text-white shadow-[0_30px_65px_rgba(220,38,38,0.3)] transition hover:bg-red-500 sm:h-60 sm:w-60"
            >
              <span>
                SOS
                <span className="mt-2 block text-sm font-medium uppercase tracking-[0.28em] text-red-100">
                  Send Alert
                </span>
              </span>
            </button>
            <div className="mt-5 text-center text-sm leading-7 text-slate-600">
              Pressing this immediately creates a live incident for staff and admin teams.
            </div>
          </div>
        </div>

        {lastConfirmation ? (
          <div className="mt-6 rounded-[26px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
            {lastConfirmation}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Recent Incident Activity"
        description="A quick view of what is already happening around the facility helps users understand overall response activity."
      >
        <div className="space-y-4">
          {incidents.slice(0, 4).map((incident) => (
            <IncidentListRow key={incident.id} incident={incident} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function AdminDashboard({ incidents, onAssignStaff, onResolveIncident }) {
  return (
    <SectionCard
      title="Admin Dashboard"
      description="The command center keeps incident triage, assignment, and resolution in one shared real-time view."
    >
      <div className="space-y-4">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className={`rounded-[28px] border p-5 shadow-sm ${
              incident.status === "Active"
                ? "border-red-200 bg-[linear-gradient(180deg,rgba(254,242,242,0.95),rgba(255,255,255,0.95))]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <EmergencyBadge type={incident.type} />
                  <StatusPill status={incident.status} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{incident.location}</h3>
                <div className="mt-2 text-sm text-slate-500">
                  {formatDateTime(incident.timestamp)} • {incident.source} • Workflow: {incident.responseState}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  Assign staff
                  <select
                    value={incident.assignedStaff}
                    onChange={(event) => onAssignStaff(incident.id, event.target.value)}
                    className="input-shell min-w-[220px]"
                  >
                    <option value="">Select team</option>
                    {staffRoster.map((staffName) => (
                      <option key={staffName} value={staffName}>
                        {staffName}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => onResolveIncident(incident.id)}
                  disabled={incident.status === "Resolved"}
                  className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                    incident.status === "Resolved"
                      ? "cursor-not-allowed bg-slate-200 text-slate-500"
                      : "bg-blue-600 text-white shadow-[0_18px_40px_rgba(37,99,235,0.2)] hover:bg-blue-500"
                  }`}
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function StaffPanel({ incidents, onDecision, onStatusChange }) {
  const assignedIncidents = incidents.filter((incident) => incident.assignedStaff);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
      <SectionCard
        title="Assigned Incidents"
        description="Staff receive their tasks here, can accept or reject assignments, and keep the command center updated."
      >
        <div className="space-y-4">
          {assignedIncidents.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              No assigned incidents yet. Assign a team from the admin dashboard to activate this panel.
            </div>
          ) : null}

          {assignedIncidents.map((incident) => (
            <div key={incident.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <EmergencyBadge type={incident.type} />
                <StatusPill status={incident.status} />
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {incident.assignedStaff}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-slate-950">{incident.location}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Assigned from {incident.source}. Current workflow state: {incident.responseState}.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onDecision(incident.id, "Accept")}
                  className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Accept Task
                </button>
                <button
                  type="button"
                  onClick={() => onDecision(incident.id, "Reject")}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Reject Task
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(incident.id, "In Progress")}
                  className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => onStatusChange(incident.id, "Resolved")}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Response Guidance"
        description="A compact responder view keeps the next actions visible without burying the essentials."
      >
        <div className="grid gap-4">
          {[
            "Confirm the exact room, floor, or camera zone before moving.",
            "Use evacuation mode if the incident affects circulation routes.",
            "Update task status as soon as on-site assessment begins."
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <p className="text-sm leading-7 text-slate-600">{item}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function AIDetectionPanel({ aiStatus, onSimulate, onReset, incidents }) {
  const recentAiIncident = incidents.find((incident) => incident.source === "AI Detection") ?? incidents[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <SectionCard
        title="AI Detection Panel"
        description="This simulated camera feed shows how an automated detection model can escalate a threat into the shared incident system."
      >
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="camera-feed">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
              <span>Camera 04</span>
              <span>{aiStatus.state === "danger" ? "Alert event" : "Monitoring"}</span>
            </div>
            <div className="mt-8 flex h-full flex-col justify-between">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-20 rounded-2xl border ${
                      aiStatus.state === "danger" && index >= 3
                        ? "border-red-400 bg-red-500/20"
                        : "border-white/10 bg-white/5"
                    }`}
                  />
                ))}
              </div>
              <div className={`mt-8 rounded-[24px] border px-4 py-4 ${aiStatus.state === "danger" ? "border-red-400 bg-red-500/20 text-red-100" : "border-white/10 bg-white/5 text-slate-300"}`}>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Radar className="h-4 w-4" />
                  {aiStatus.headline}
                </div>
                <div className="mt-2 text-sm leading-7">{aiStatus.detail}</div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-800">Detection status</div>
              <div className={`mt-4 rounded-[24px] bg-gradient-to-r p-5 text-white ${aiStatus.state === "danger" ? "from-red-600 via-red-500 to-orange-400" : "from-blue-700 via-blue-600 to-cyan-500"}`}>
                <div className="flex items-center gap-3">
                  {aiStatus.state === "danger" ? <Flame className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                  <span className="text-lg font-semibold">{aiStatus.headline}</span>
                </div>
                <p className="mt-3 text-sm text-white/90">{aiStatus.detail}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onSimulate}
                  className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  Simulate Detection
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
                >
                  Reset Feed
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-800">Last AI-linked incident</div>
              <div className="mt-4 rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <EmergencyBadge type={recentAiIncident.type} />
                  <StatusPill status={recentAiIncident.status} />
                </div>
                <div className="mt-4 text-base font-semibold text-slate-950">{recentAiIncident.location}</div>
                <div className="mt-2 text-sm text-slate-600">{formatDateTime(recentAiIncident.timestamp)}</div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function EvacuationScreen({ incidents }) {
  const focusIncident = incidents.find((incident) => incident.status === "Active") ?? incidents[0];
  const routeCells = ["A1", "A2", "B2", "C2", "C3", "Exit"];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <SectionCard
        title="Evacuation Screen"
        description="A simplified floor layout keeps attention on the nearest exit and the safest movement path."
      >
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-800">Floor layout</div>
                <div className="mt-1 text-sm text-slate-500">Nearest exit route highlighted</div>
              </div>
              <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
                Exit East
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"].map((cell) => {
                const highlighted = routeCells.includes(cell);
                return (
                  <div
                    key={cell}
                    className={`flex aspect-square items-center justify-center rounded-[24px] border text-sm font-semibold ${
                      highlighted
                        ? "border-blue-300 bg-blue-600 text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)]"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex justify-end">
              <div className="flex h-24 w-24 items-center justify-center rounded-[24px] border border-emerald-300 bg-emerald-100 text-sm font-semibold text-emerald-700">
                Exit
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-red-200 bg-red-50 p-5">
              <div className="text-sm font-semibold text-red-700">Incident focus</div>
              <div className="mt-3 text-xl font-semibold text-slate-950">{focusIncident.type}</div>
              <div className="mt-2 text-sm text-slate-600">{focusIncident.location}</div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-800">Safe route guidance</div>
              <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <li className="rounded-2xl bg-slate-50 px-4 py-3">Move east from the current room corridor.</li>
                <li className="rounded-2xl bg-slate-50 px-4 py-3">Continue through the blue-marked central path.</li>
                <li className="rounded-2xl bg-slate-50 px-4 py-3">Use Exit East and proceed to the assembly point.</li>
              </ol>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({ title, description, children, actionLabel, actionValue }) {
  return (
    <section className="panel-surface p-6 sm:p-7">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">{title}</div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
        </div>
        {actionLabel && actionValue ? (
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            {actionLabel}: <span className="text-slate-900">{actionValue}</span>
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function FeatureTile({ icon, title, text, accent }) {
  const Icon = icon;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          accent === "red" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-lg font-semibold text-slate-950">{title}</div>
      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function InfoBand({ icon, title, text }) {
  const Icon = icon;

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-xl font-semibold text-slate-950">{title}</div>
      <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function SnapshotRow({ icon, label, value }) {
  const Icon = icon;

  return (
    <div className="flex items-start gap-4 rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        <div className="mt-1 text-sm leading-7 text-slate-600">{value}</div>
      </div>
    </div>
  );
}

function MetricMini({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="panel-surface p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className={`mt-4 text-3xl font-semibold ${accent === "red" ? "text-red-600" : "text-blue-700"}`}>{value}</div>
    </div>
  );
}

function LandingMetric({ label, value, detail, accent }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className={`mt-3 text-3xl font-semibold ${accent === "red" ? "text-red-600" : "text-blue-700"}`}>{value}</div>
      <div className="mt-2 text-sm leading-6 text-slate-600">{detail}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-slate-700">{label}</div>
      {children}
    </label>
  );
}

function IncidentListRow({ incident }) {
  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <EmergencyBadge type={incident.type} />
        <div>
          <div className="text-base font-semibold text-slate-900">{incident.location}</div>
          <div className="text-sm text-slate-500">{formatDateTime(incident.timestamp)}</div>
        </div>
      </div>
      <StatusPill status={incident.status} />
    </div>
  );
}

function EmergencyBadge({ type }) {
  const meta = emergencyMeta[type];
  const Icon = meta.icon;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] ring-1 ${meta.tone}`}>
      <Icon className="h-4 w-4" />
      {type}
    </span>
  );
}

function StatusPill({ status }) {
  const isResolved = status === "Resolved";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] ${
        isResolved ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${isResolved ? "bg-emerald-500" : "bg-red-500"}`} />
      {status}
    </span>
  );
}

function AlertStack({ alerts }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-[26px] border px-4 py-4 shadow-[0_22px_50px_rgba(15,23,42,0.15)] backdrop-blur ${
            alert.tone === "success"
              ? "border-emerald-200 bg-white/95"
              : alert.tone === "info"
                ? "border-blue-200 bg-white/95"
                : "alert-popup border-red-200 bg-white/95"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                alert.tone === "success"
                  ? "bg-emerald-100 text-emerald-700"
                  : alert.tone === "info"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-600"
              }`}
            >
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{alert.title}</div>
              <div className="mt-1 text-sm leading-6 text-slate-600">{alert.message}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDateTime(value) {
  return new Date(value).toLocaleString();
}

function isoMinutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

export default App;
