
export function aggregateJson(target: any, source: any) {
  if (!source) return target;
  if (!target) return JSON.parse(JSON.stringify(source));

  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceVal = source[key];
      const targetVal = result[key];

      if (typeof sourceVal === 'number') {
        result[key] = (targetVal || 0) + sourceVal;
      } else if (typeof sourceVal === 'object' && sourceVal !== null) {
        result[key] = aggregateJson(targetVal || {}, sourceVal);
      } else if (typeof sourceVal === 'string') {
          // For strings, we might not want to aggregate unless they are numeric-like
          // But usually, we only aggregate numbers.
          // If target is empty, we can take source.
          if (targetVal === undefined || targetVal === null || targetVal === '') {
              result[key] = sourceVal;
          }
      }
    }
  }

  return result;
}

export function aggregateReports(reports: any[]): any {
  if (!reports || reports.length === 0) return {};

  let aggregated = {};

  const sections = [
    'headerInfo', 'unitDawat', 'personalDawat', 'generalMeeting',
    'publicRelations', 'prCampaign', 'departmentalInfo', 'dawahPublication',
    'programs', 'manpower', 'deptManpower', 'unitStats', 'studentJoining',
    'safar', 'donors', 'orgMeetings', 'training', 'socialWork',
    'political', 'finance', 'baitulmal', 'organizationData', 'dawah',
    'miscellaneous', 'remarks', 'unitOrganization'
  ];

  for (const report of reports) {
    for (const section of sections) {
      if (report[section]) {
        aggregated[section] = aggregateJson(aggregated[section] || {}, report[section]);
      }
    }
  }

  return aggregated;
}
