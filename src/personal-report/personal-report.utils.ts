export const MAX_SALAH_JAMAAT = 5;
export const MAX_ORG_WORK_SECONDS = 23 * 3600 + 59 * 60 + 59;

export function normalizeSalahJamaat(value: unknown): number {
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }

  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.min(MAX_SALAH_JAMAAT, Math.max(0, Math.trunc(numericValue)));
}

export function normalizeOrgWorkTotalSeconds(
  hours: unknown,
  minutes: unknown,
  seconds: unknown,
): number {
  const numericHours = Number(hours ?? 0);
  const numericMinutes = Number(minutes ?? 0);
  const numericSeconds = Number(seconds ?? 0);

  const totalSeconds =
    (Number.isFinite(numericHours) ? Math.trunc(numericHours) : 0) * 3600 +
    (Number.isFinite(numericMinutes) ? Math.trunc(numericMinutes) : 0) * 60 +
    (Number.isFinite(numericSeconds) ? Math.trunc(numericSeconds) : 0);

  return Math.min(MAX_ORG_WORK_SECONDS, Math.max(0, totalSeconds));
}

export function splitOrgWorkSeconds(totalSeconds: number): {
  orgWorkHours: number;
  orgWorkMinutes: number;
  orgWorkSeconds: number;
} {
  const normalizedTotal = Math.min(MAX_ORG_WORK_SECONDS, Math.max(0, Math.trunc(totalSeconds)));

  return {
    orgWorkHours: Math.floor(normalizedTotal / 3600),
    orgWorkMinutes: Math.floor((normalizedTotal % 3600) / 60),
    orgWorkSeconds: normalizedTotal % 60,
  };
}

export function getElapsedOrgWorkSeconds(startedAt: Date, now: Date = new Date()): number {
  const diffMs = now.getTime() - startedAt.getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) {
    return 0;
  }

  return Math.floor(diffMs / 1000);
}
