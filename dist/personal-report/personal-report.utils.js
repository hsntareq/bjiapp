"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_ORG_WORK_SECONDS = exports.MAX_SALAH_JAMAAT = void 0;
exports.normalizeSalahJamaat = normalizeSalahJamaat;
exports.normalizeOrgWorkTotalSeconds = normalizeOrgWorkTotalSeconds;
exports.splitOrgWorkSeconds = splitOrgWorkSeconds;
exports.getElapsedOrgWorkSeconds = getElapsedOrgWorkSeconds;
exports.MAX_SALAH_JAMAAT = 5;
exports.MAX_ORG_WORK_SECONDS = 23 * 3600 + 59 * 60 + 59;
function normalizeSalahJamaat(value) {
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }
    const numericValue = Number(value ?? 0);
    if (!Number.isFinite(numericValue)) {
        return 0;
    }
    return Math.min(exports.MAX_SALAH_JAMAAT, Math.max(0, Math.trunc(numericValue)));
}
function normalizeOrgWorkTotalSeconds(hours, minutes, seconds) {
    const numericHours = Number(hours ?? 0);
    const numericMinutes = Number(minutes ?? 0);
    const numericSeconds = Number(seconds ?? 0);
    const totalSeconds = (Number.isFinite(numericHours) ? Math.trunc(numericHours) : 0) * 3600 +
        (Number.isFinite(numericMinutes) ? Math.trunc(numericMinutes) : 0) * 60 +
        (Number.isFinite(numericSeconds) ? Math.trunc(numericSeconds) : 0);
    return Math.min(exports.MAX_ORG_WORK_SECONDS, Math.max(0, totalSeconds));
}
function splitOrgWorkSeconds(totalSeconds) {
    const normalizedTotal = Math.min(exports.MAX_ORG_WORK_SECONDS, Math.max(0, Math.trunc(totalSeconds)));
    return {
        orgWorkHours: Math.floor(normalizedTotal / 3600),
        orgWorkMinutes: Math.floor((normalizedTotal % 3600) / 60),
        orgWorkSeconds: normalizedTotal % 60,
    };
}
function getElapsedOrgWorkSeconds(startedAt, now = new Date()) {
    const diffMs = now.getTime() - startedAt.getTime();
    if (!Number.isFinite(diffMs) || diffMs <= 0) {
        return 0;
    }
    return Math.floor(diffMs / 1000);
}
//# sourceMappingURL=personal-report.utils.js.map