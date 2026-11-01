// Mediane je Punkt und Effizienz-Index (siehe .claude/rules/work-statistics.md). Verglichen wird
// nur innerhalb eines Messverfahrens (zwischen zwei Messbrüchen); 100 = Median, höher = effizienter.
export const WEIGHTS = {
  tokens: 0.3,
  tools: 0.2,
  minutes: 0.2,
  failures: 0.15,
  interactions: 0.15,
};
export const PROVISIONAL_BELOW = 3;
const SUMMED = ['minutes', 'prompts', 'questions', 'tools', 'failures', 'output', 'tokens'];

export function median(values) {
  const sorted = values.filter((value) => value !== null).sort((left, right) => left - right);
  if (sorted.length === 0) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

// Je Stand: Messverfahren (Epoche) und der Stand, dem er in der Übersicht zugeschlagen wird.
// Nicht wirkungsrelevante Stände zählen zum vorigen Stand, ein Messbruch beginnt immer neu.
export function resolveStands(stands) {
  const resolved = new Map();
  let epoch = 0;
  let group;
  for (const [position, stand] of stands.entries()) {
    if (stand.breaks && position > 0) epoch += 1;
    if (!group || stand.breaks || stand.impact !== 'nicht wirkungsrelevant') group = stand;
    resolved.set(stand.stand, { epoch, group });
  }
  return resolved;
}

// Läufe mit Punkten nach Slug: der erste Lauf führt, spätere zählen als Nacharbeit dazu.
export function reworkGroups(runs) {
  const bySlug = new Map();
  for (const run of runs.filter((candidate) => candidate.points)) {
    const group = bySlug.get(run.slug) ?? { lead: run, members: [] };
    if (group.lead !== run) group.members.push(run);
    bySlug.set(run.slug, group);
  }
  return [...bySlug.values()];
}

export function perPoint({ lead, members }) {
  const runs = [lead, ...members];
  const sum = Object.fromEntries(
    SUMMED.map((key) => [key, runs.reduce((total, run) => total + (run[key] ?? 0), 0)]),
  );
  const diff = runs.some((run) => run.added === null)
    ? null
    : runs.reduce((total, run) => total + run.added + run.removed, 0);
  const points = lead.points;
  return {
    minutes: sum.minutes / points,
    tools: sum.tools / points,
    tokens: sum.tokens / points,
    output: sum.output / points,
    failures: (sum.failures + 1) / points,
    interactions: (Math.max(0, sum.prompts + sum.questions - 2) + 1) / points,
    diff: diff === null ? null : diff / points,
  };
}

export function medianMetrics(metricsList) {
  const keys = [...Object.keys(WEIGHTS), 'output', 'diff'];
  return Object.fromEntries(
    keys.map((key) => [key, median(metricsList.map((metrics) => metrics[key]))]),
  );
}

// Gewichtetes geometrisches Mittel von Median / Wert.
export function efficiencyIndex(metrics, reference) {
  const logSum = Object.entries(WEIGHTS).reduce((total, [key, weight]) => {
    const value = metrics[key];
    const base = reference[key];
    return value > 0 && base > 0 ? total + weight * Math.log(base / value) : total;
  }, 0);
  return Math.round(100 * Math.exp(logSum));
}

function standSummaries(groups, stands, resolved, epochMedians) {
  return stands
    .filter((stand) => resolved.get(stand.stand).group === stand)
    .map((stand) => {
      const own = groups.filter((group) => group.standGroup === stand);
      const medians = medianMetrics(own.map((group) => group.metrics));
      const { epoch } = resolved.get(stand.stand);
      const index = own.length ? efficiencyIndex(medians, epochMedians.get(epoch)) : null;
      return { stand, epoch, count: own.length, medians, index };
    });
}

export function analyze(runs, stands) {
  const resolved = resolveStands(stands);
  const fallback = { epoch: 0, group: stands.at(-1) };
  const groups = reworkGroups(runs).map((group) => {
    const { epoch, group: standGroup } = resolved.get(group.lead.stand) ?? fallback;
    return { ...group, epoch, standGroup, metrics: perPoint(group) };
  });
  const epochMedians = new Map();
  for (const epoch of new Set(groups.map((group) => group.epoch))) {
    const inEpoch = groups.filter((group) => group.epoch === epoch);
    epochMedians.set(epoch, medianMetrics(inEpoch.map((group) => group.metrics)));
  }
  for (const group of groups)
    group.index = efficiencyIndex(group.metrics, epochMedians.get(group.epoch));
  const leadOf = new Map(groups.flatMap((group) => group.members.map((run) => [run, group.lead])));
  const groupOf = new Map(groups.map((group) => [group.lead, group]));
  return {
    summaries: standSummaries(groups, stands, resolved, epochMedians),
    reworkLabel(run) {
      if (leadOf.has(run)) return `zu ${leadOf.get(run).date}`;
      const members = groupOf.get(run)?.members ?? [];
      return members.length ? `ja (${members.map((member) => member.date).join(', ')})` : '–';
    },
    indexLabel: (run) => `${groupOf.get(run)?.index ?? '–'}`,
  };
}
