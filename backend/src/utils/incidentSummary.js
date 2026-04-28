import Incident from "../models/Incident.js";

const buildIncidentSummary = async () => {
  const [active, resolved, critical] = await Promise.all([
    Incident.countDocuments({ status: "active" }),
    Incident.countDocuments({ status: "resolved" }),
    Incident.countDocuments({ severity: "critical", status: "active" })
  ]);

  return {
    active,
    resolved,
    critical,
    total: active + resolved
  };
};

export default buildIncidentSummary;

