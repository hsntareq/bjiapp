export declare const MAX_SALAH_JAMAAT = 5;
export declare const MAX_ORG_WORK_SECONDS: number;
export declare function normalizeSalahJamaat(value: unknown): number;
export declare function normalizeOrgWorkTotalSeconds(hours: unknown, minutes: unknown, seconds: unknown): number;
export declare function splitOrgWorkSeconds(totalSeconds: number): {
    orgWorkHours: number;
    orgWorkMinutes: number;
    orgWorkSeconds: number;
};
export declare function getElapsedOrgWorkSeconds(startedAt: Date, now?: Date): number;
