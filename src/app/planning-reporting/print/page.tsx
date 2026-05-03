import { getWardTemplate } from './ward-template';
import { getThanaTemplate } from './thana-template';

const monthNames: string[] = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export interface PrintPageParams {
  orgId?: string;
  year?: string;
  month?: string;
  orglevel?: string;
  token?: string;
}

export interface ReportData {
  orgName?: string;
  thanaName?: string;
  wardNumber?: string;
  wardName?: string;
  totalWards?: string | number;
  manpower?: Record<string, any>;
  unitDawat?: Record<string, any>;
  personalDawat?: Record<string, any>;
  generalMeeting?: Record<string, any>;
  programs?: Record<string, any>;
  dawahPublication?: Record<string, any>;
  finance?: Record<string, any>;
  baitulmal?: Record<string, any>;
  socialWork?: Record<string, any>;
  miscellaneous?: Record<string, any>;
  remarks?: Record<string, any>;
  orgMeetings?: Record<string, any>;
  training?: Record<string, any>;
  wardReports?: Record<string, any>[];
}

function getMonthName(month?: string): string {
  if (!month) return monthNames[new Date().getMonth()];
  const index = parseInt(month, 10);
  if (isNaN(index) || index < 1 || index > 12) return monthNames[new Date().getMonth()];
  return monthNames[index - 1];
}

function safeVal(val: any, fallback = ''): string {
  if (val === null || val === undefined) return fallback;
  return String(val);
}

function buildWardManpowerRows(wardReports: Record<string, any>[]): string {
  return wardReports
    .map((w) => {
      const m = w.manpower ?? {};
      const rukonPrev = safeVal(m.rukon_prev, '০');
      const rukonCurr = safeVal(m.rukon_current, '০');
      const kormiPrev = safeVal(m.kormi_prev, '০');
      const kormiCurr = safeVal(m.kormi_current, '০');
      const sathiPrev = safeVal(m.sathi_prev, '০');
      const sathiCurr = safeVal(m.sathi_current, '০');
      const supPrev = safeVal(m.supporter_prev, '০');
      const supCurr = safeVal(m.supporter_current, '০');
      const total =
        (parseInt(rukonCurr) || 0) +
        (parseInt(kormiCurr) || 0) +
        (parseInt(sathiCurr) || 0) +
        (parseInt(supCurr) || 0);
      return `<tr>
        <td class="left">${safeVal(w.wardName, 'ওয়ার্ড')}</td>
        <td>${rukonPrev}</td><td>${rukonCurr}</td>
        <td>${kormiPrev}</td><td>${kormiCurr}</td>
        <td>${sathiPrev}</td><td>${sathiCurr}</td>
        <td>${supPrev}</td><td>${supCurr}</td>
        <td>${total}</td>
      </tr>`;
    })
    .join('\n');
}

function buildWardDawatRows(wardReports: Record<string, any>[]): string {
  return wardReports
    .map((w) => {
      const ud = w.unitDawat ?? {};
      const pd = w.personalDawat ?? {};
      return `<tr>
        <td class="left">${safeVal(w.wardName, 'ওয়ার্ড')}</td>
        <td>${safeVal(ud.group_target, '০')}</td>
        <td>${safeVal(ud.group_achieved, '০')}</td>
        <td>${safeVal(ud.new_target, '০')}</td>
        <td>${safeVal(ud.new_achieved, '০')}</td>
        <td>${safeVal(pd.sathi_target, '০')}</td>
        <td>${safeVal(pd.sathi_achieved, '০')}</td>
        <td>${safeVal(pd.kormi_target, '০')}</td>
        <td>${safeVal(pd.kormi_achieved, '০')}</td>
      </tr>`;
    })
    .join('\n');
}

function buildWardMeetingRows(wardReports: Record<string, any>[]): string {
  return wardReports
    .map((w) => {
      const gm = w.generalMeeting ?? {};
      const om = w.orgMeetings ?? {};
      return `<tr>
        <td class="left">${safeVal(w.wardName, 'ওয়ার্ড')}</td>
        <td>${safeVal(gm.general_target, '০')}</td>
        <td>${safeVal(gm.general_held, '০')}</td>
        <td>${safeVal(gm.general_attendance, '০')}</td>
        <td>${safeVal(om.executive_target, '০')}</td>
        <td>${safeVal(om.executive_held, '০')}</td>
        <td>${safeVal(om.executive_attendance, '০')}</td>
        <td>${safeVal(om.workers_target, '০')}</td>
        <td>${safeVal(om.workers_held, '০')}</td>
        <td>${safeVal(om.workers_attendance, '০')}</td>
      </tr>`;
    })
    .join('\n');
}

function buildWardProgramRows(wardReports: Record<string, any>[]): string {
  return wardReports
    .map((w) => {
      const p = w.programs ?? {};
      return `<tr>
        <td class="left">${safeVal(w.wardName, 'ওয়ার্ড')}</td>
        <td>${safeVal(p.target, '০')}</td>
        <td>${safeVal(p.achieved, '০')}</td>
        <td>${safeVal(p.participants, '০')}</td>
        <td>${safeVal(p.remarks, '')}</td>
      </tr>`;
    })
    .join('\n');
}

function buildWardPublicationRows(wardReports: Record<string, any>[]): string {
  return wardReports
    .map((w) => {
      const dp = w.dawahPublication ?? {};
      return `<tr>
        <td class="left">${safeVal(w.wardName, 'ওয়ার্ড')}</td>
        <td>${safeVal(dp.books_target, '০')}</td>
        <td>${safeVal(dp.books_achieved, '০')}</td>
        <td>${safeVal(dp.leaflet_target, '০')}</td>
        <td>${safeVal(dp.leaflet_achieved, '০')}</td>
        <td>${safeVal(dp.paper_target, '০')}</td>
        <td>${safeVal(dp.paper_achieved, '০')}</td>
      </tr>`;
    })
    .join('\n');
}

function buildWardFinanceRows(wardReports: Record<string, any>[]): string {
  return wardReports
    .map((w) => {
      const f = w.baitulmal ?? w.finance ?? {};
      return `<tr>
        <td class="left">${safeVal(w.wardName, 'ওয়ার্ড')}</td>
        <td>${safeVal(f.chanda_target, '০')}</td>
        <td>${safeVal(f.chanda_achieved, '০')}</td>
        <td>${safeVal(f.special_target, '০')}</td>
        <td>${safeVal(f.special_achieved, '০')}</td>
        <td>${safeVal(f.total_target, '০')}</td>
        <td>${safeVal(f.total_achieved, '০')}</td>
      </tr>`;
    })
    .join('\n');
}

function renderWardTemplate(data: ReportData, month: string, year: string): string {
  const m = data.manpower ?? {};
  const ud = data.unitDawat ?? {};
  const pd = data.personalDawat ?? {};
  const gm = data.generalMeeting ?? {};
  const om = data.orgMeetings ?? {};
  const pr = data.programs ?? {};
  const dp = data.dawahPublication ?? {};
  const bm = data.baitulmal ?? data.finance ?? {};
  const sw = data.socialWork ?? {};
  const misc = data.miscellaneous ?? data.remarks ?? {};

  const today = new Date().toLocaleDateString('bn-BD');

  let output = getWardTemplate();

  // Basic Metadata
  output = output.replace(/{{month}}/g, getMonthName(month));
  output = output.replace(/{{year}}/g, safeVal(year));
  output = output.replace(/{{orgName}}/g, safeVal(data.orgName, 'সংগঠনের নাম'));
  output = output.replace(/{{thanaName}}/g, safeVal(data.thanaName, ''));
  output = output.replace(/{{wardNumber}}/g, safeVal(data.wardNumber, ''));
  output = output.replace(/{{wardName}}/g, safeVal(data.wardName, ''));
  output = output.replace(/{{submittedDate}}/g, today);
  output = output.replace(/{{generatedDate}}/g, today);

  // Manpower
  output = output.replace(/{{manpower_rukon_prev}}/g, safeVal(m.rukon_prev, '০'));
  output = output.replace(/{{manpower_rukon_increase}}/g, safeVal(m.rukon_increase, '০'));
  output = output.replace(/{{manpower_rukon_decrease}}/g, safeVal(m.rukon_decrease, '০'));
  output = output.replace(/{{manpower_rukon_current}}/g, safeVal(m.rukon_current, '০'));
  output = output.replace(/{{manpower_rukon_remarks}}/g, safeVal(m.rukon_remarks, ''));
  output = output.replace(/{{manpower_kormi_prev}}/g, safeVal(m.kormi_prev, '০'));
  output = output.replace(/{{manpower_kormi_increase}}/g, safeVal(m.kormi_increase, '০'));
  output = output.replace(/{{manpower_kormi_decrease}}/g, safeVal(m.kormi_decrease, '০'));
  output = output.replace(/{{manpower_kormi_current}}/g, safeVal(m.kormi_current, '০'));
  output = output.replace(/{{manpower_kormi_remarks}}/g, safeVal(m.kormi_remarks, ''));
  output = output.replace(/{{manpower_sathi_prev}}/g, safeVal(m.sathi_prev, '০'));
  output = output.replace(/{{manpower_sathi_increase}}/g, safeVal(m.sathi_increase, '০'));
  output = output.replace(/{{manpower_sathi_decrease}}/g, safeVal(m.sathi_decrease, '০'));
  output = output.replace(/{{manpower_sathi_current}}/g, safeVal(m.sathi_current, '০'));
  output = output.replace(/{{manpower_sathi_remarks}}/g, safeVal(m.sathi_remarks, ''));
  output = output.replace(/{{manpower_supporter_prev}}/g, safeVal(m.supporter_prev, '০'));
  output = output.replace(/{{manpower_supporter_increase}}/g, safeVal(m.supporter_increase, '০'));
  output = output.replace(/{{manpower_supporter_decrease}}/g, safeVal(m.supporter_decrease, '০'));
  output = output.replace(/{{manpower_supporter_current}}/g, safeVal(m.supporter_current, '০'));
  output = output.replace(/{{manpower_supporter_remarks}}/g, safeVal(m.supporter_remarks, ''));

  // Unit Dawat
  output = output.replace(/{{unitdawat_group_target}}/g, safeVal(ud.group_target, '০'));
  output = output.replace(/{{unitdawat_group_achieved}}/g, safeVal(ud.group_achieved, '০'));
  output = output.replace(/{{unitdawat_group_remarks}}/g, safeVal(ud.group_remarks, ''));
  output = output.replace(/{{unitdawat_attendance_target}}/g, safeVal(ud.attendance_target, '০'));
  output = output.replace(/{{unitdawat_attendance_achieved}}/g, safeVal(ud.attendance_achieved, '০'));
  output = output.replace(/{{unitdawat_attendance_remarks}}/g, safeVal(ud.attendance_remarks, ''));
  output = output.replace(/{{unitdawat_new_target}}/g, safeVal(ud.new_target, '০'));
  output = output.replace(/{{unitdawat_new_achieved}}/g, safeVal(ud.new_achieved, '০'));
  output = output.replace(/{{unitdawat_new_remarks}}/g, safeVal(ud.new_remarks, ''));

  // Personal Dawat
  output = output.replace(/{{dawat_contacts_target}}/g, safeVal(pd.contacts_target, '০'));
  output = output.replace(/{{dawat_contacts_achieved}}/g, safeVal(pd.contacts_achieved, '০'));
  output = output.replace(/{{dawat_contacts_remarks}}/g, safeVal(pd.contacts_remarks, ''));
  output = output.replace(/{{dawat_sathi_target}}/g, safeVal(pd.sathi_target, '০'));
  output = output.replace(/{{dawat_sathi_achieved}}/g, safeVal(pd.sathi_achieved, '০'));
  output = output.replace(/{{dawat_sathi_remarks}}/g, safeVal(pd.sathi_remarks, ''));
  output = output.replace(/{{dawat_kormi_target}}/g, safeVal(pd.kormi_target, '০'));
  output = output.replace(/{{dawat_kormi_achieved}}/g, safeVal(pd.kormi_achieved, '০'));
  output = output.replace(/{{dawat_kormi_remarks}}/g, safeVal(pd.kormi_remarks, ''));

  // General Meetings
  output = output.replace(/{{meeting_general_target}}/g, safeVal(gm.general_target, '০'));
  output = output.replace(/{{meeting_general_held}}/g, safeVal(gm.general_held, '০'));
  output = output.replace(/{{meeting_general_attendance}}/g, safeVal(gm.general_attendance, '০'));
  output = output.replace(/{{meeting_general_remarks}}/g, safeVal(gm.general_remarks, ''));
  output = output.replace(/{{meeting_executive_target}}/g, safeVal(om.executive_target, '০'));
  output = output.replace(/{{meeting_executive_held}}/g, safeVal(om.executive_held, '০'));
  output = output.replace(/{{meeting_executive_attendance}}/g, safeVal(om.executive_attendance, '০'));
  output = output.replace(/{{meeting_executive_remarks}}/g, safeVal(om.executive_remarks, ''));
  output = output.replace(/{{meeting_workers_target}}/g, safeVal(om.workers_target, '০'));
  output = output.replace(/{{meeting_workers_held}}/g, safeVal(om.workers_held, '০'));
  output = output.replace(/{{meeting_workers_attendance}}/g, safeVal(om.workers_attendance, '০'));
  output = output.replace(/{{meeting_workers_remarks}}/g, safeVal(om.workers_remarks, ''));

  // Programs
  const programList = Array.isArray(pr.items) ? pr.items : [];
  for (let i = 0; i < 3; i++) {
    const prog = programList[i] ?? {};
    const n = i + 1;
    output = output.replace(new RegExp(`{{program_${n}_name}}`, 'g'), safeVal(prog.name, ''));
    output = output.replace(new RegExp(`{{program_${n}_target}}`, 'g'), safeVal(prog.target, '০'));
    output = output.replace(new RegExp(`{{program_${n}_achieved}}`, 'g'), safeVal(prog.achieved, '০'));
    output = output.replace(new RegExp(`{{program_${n}_participants}}`, 'g'), safeVal(prog.participants, '০'));
    output = output.replace(new RegExp(`{{program_${n}_remarks}}`, 'g'), safeVal(prog.remarks, ''));
  }

  // Publication
  output = output.replace(/{{pub_books_target}}/g, safeVal(dp.books_target, '০'));
  output = output.replace(/{{pub_books_achieved}}/g, safeVal(dp.books_achieved, '০'));
  output = output.replace(/{{pub_books_remarks}}/g, safeVal(dp.books_remarks, ''));
  output = output.replace(/{{pub_leaflet_target}}/g, safeVal(dp.leaflet_target, '০'));
  output = output.replace(/{{pub_leaflet_achieved}}/g, safeVal(dp.leaflet_achieved, '০'));
  output = output.replace(/{{pub_leaflet_remarks}}/g, safeVal(dp.leaflet_remarks, ''));
  output = output.replace(/{{pub_paper_target}}/g, safeVal(dp.paper_target, '০'));
  output = output.replace(/{{pub_paper_achieved}}/g, safeVal(dp.paper_achieved, '০'));
  output = output.replace(/{{pub_paper_remarks}}/g, safeVal(dp.paper_remarks, ''));

  // Finance / Baitulmal
  output = output.replace(/{{finance_chanda_target}}/g, safeVal(bm.chanda_target, '০'));
  output = output.replace(/{{finance_chanda_achieved}}/g, safeVal(bm.chanda_achieved, '০'));
  output = output.replace(/{{finance_chanda_remarks}}/g, safeVal(bm.chanda_remarks, ''));
  output = output.replace(/{{finance_special_target}}/g, safeVal(bm.special_target, '০'));
  output = output.replace(/{{finance_special_achieved}}/g, safeVal(bm.special_achieved, '০'));
  output = output.replace(/{{finance_special_remarks}}/g, safeVal(bm.special_remarks, ''));
  const totalTarget = (parseFloat(bm.chanda_target) || 0) + (parseFloat(bm.special_target) || 0);
  const totalAchieved = (parseFloat(bm.chanda_achieved) || 0) + (parseFloat(bm.special_achieved) || 0);
  output = output.replace(/{{finance_total_target}}/g, String(totalTarget));
  output = output.replace(/{{finance_total_achieved}}/g, String(totalAchieved));
  output = output.replace(/{{finance_total_remarks}}/g, safeVal(bm.total_remarks, ''));

  // Social Work
  const socialList = Array.isArray(sw.items) ? sw.items : [];
  for (let i = 0; i < 2; i++) {
    const s = socialList[i] ?? {};
    const n = i + 1;
    output = output.replace(new RegExp(`{{social_${n}_name}}`, 'g'), safeVal(s.name, ''));
    output = output.replace(new RegExp(`{{social_${n}_target}}`, 'g'), safeVal(s.target, '০'));
    output = output.replace(new RegExp(`{{social_${n}_achieved}}`, 'g'), safeVal(s.achieved, '০'));
    output = output.replace(new RegExp(`{{social_${n}_remarks}}`, 'g'), safeVal(s.remarks, ''));
  }

  // Miscellaneous
  output = output.replace(/{{miscellaneous_remarks}}/g, safeVal(misc.remarks ?? misc.text, ''));

  return output;
}

function renderThanaTemplate(data: ReportData, month: string, year: string): string {
  const wardReports = data.wardReports ?? [];
  const today = new Date().toLocaleDateString('bn-BD');

  let output = getThanaTemplate();

  // Basic Metadata
  output = output.replace(/{{month}}/g, getMonthName(month));
  output = output.replace(/{{year}}/g, safeVal(year));
  output = output.replace(/{{thanaName}}/g, safeVal(data.thanaName, 'থানা'));
  output = output.replace(/{{totalWards}}/g, safeVal(data.totalWards, String(wardReports.length)));
  output = output.replace(/{{submittedDate}}/g, today);
  output = output.replace(/{{generatedDate}}/g, today);

  // Build ward rows
  output = output.replace(/{{ward_manpower_rows}}/g, buildWardManpowerRows(wardReports));
  output = output.replace(/{{ward_dawat_rows}}/g, buildWardDawatRows(wardReports));
  output = output.replace(/{{ward_meeting_rows}}/g, buildWardMeetingRows(wardReports));
  output = output.replace(/{{ward_program_rows}}/g, buildWardProgramRows(wardReports));
  output = output.replace(/{{ward_publication_rows}}/g, buildWardPublicationRows(wardReports));
  output = output.replace(/{{ward_finance_rows}}/g, buildWardFinanceRows(wardReports));

  // Aggregate totals for manpower
  let totalRukonPrev = 0, totalRukonCurr = 0;
  let totalKormiPrev = 0, totalKormiCurr = 0;
  let totalSathiPrev = 0, totalSathiCurr = 0;
  let totalSupPrev = 0, totalSupCurr = 0;
  let totalGroupTarget = 0, totalGroupAchieved = 0;
  let totalNewTarget = 0, totalNewAchieved = 0;
  let totalSathiTarget = 0, totalSathiAchieved = 0;
  let totalKormiTarget = 0, totalKormiAchieved = 0;
  let totalGeneralTarget = 0, totalGeneralHeld = 0, totalGeneralAttendance = 0;
  let totalExecTarget = 0, totalExecHeld = 0, totalExecAttendance = 0;
  let totalWorkersTarget = 0, totalWorkersHeld = 0, totalWorkersAttendance = 0;
  let totalProgramsTarget = 0, totalProgramsAchieved = 0, totalProgramsParticipants = 0;
  let totalBooksTarget = 0, totalBooksAchieved = 0;
  let totalLeafletTarget = 0, totalLeafletAchieved = 0;
  let totalPaperTarget = 0, totalPaperAchieved = 0;
  let totalChandaTarget = 0, totalChandaAchieved = 0;
  let totalSpecialTarget = 0, totalSpecialAchieved = 0;

  for (const w of wardReports) {
    const m = w.manpower ?? {};
    const ud = w.unitDawat ?? {};
    const pd = w.personalDawat ?? {};
    const gm = w.generalMeeting ?? {};
    const om = w.orgMeetings ?? {};
    const pr = w.programs ?? {};
    const dp = w.dawahPublication ?? {};
    const bm = w.baitulmal ?? w.finance ?? {};

    totalRukonPrev += parseInt(m.rukon_prev) || 0;
    totalRukonCurr += parseInt(m.rukon_current) || 0;
    totalKormiPrev += parseInt(m.kormi_prev) || 0;
    totalKormiCurr += parseInt(m.kormi_current) || 0;
    totalSathiPrev += parseInt(m.sathi_prev) || 0;
    totalSathiCurr += parseInt(m.sathi_current) || 0;
    totalSupPrev += parseInt(m.supporter_prev) || 0;
    totalSupCurr += parseInt(m.supporter_current) || 0;

    totalGroupTarget += parseInt(ud.group_target) || 0;
    totalGroupAchieved += parseInt(ud.group_achieved) || 0;
    totalNewTarget += parseInt(ud.new_target) || 0;
    totalNewAchieved += parseInt(ud.new_achieved) || 0;
    totalSathiTarget += parseInt(pd.sathi_target) || 0;
    totalSathiAchieved += parseInt(pd.sathi_achieved) || 0;
    totalKormiTarget += parseInt(pd.kormi_target) || 0;
    totalKormiAchieved += parseInt(pd.kormi_achieved) || 0;

    totalGeneralTarget += parseInt(gm.general_target) || 0;
    totalGeneralHeld += parseInt(gm.general_held) || 0;
    totalGeneralAttendance += parseInt(gm.general_attendance) || 0;
    totalExecTarget += parseInt(om.executive_target) || 0;
    totalExecHeld += parseInt(om.executive_held) || 0;
    totalExecAttendance += parseInt(om.executive_attendance) || 0;
    totalWorkersTarget += parseInt(om.workers_target) || 0;
    totalWorkersHeld += parseInt(om.workers_held) || 0;
    totalWorkersAttendance += parseInt(om.workers_attendance) || 0;

    totalProgramsTarget += parseInt(pr.target) || 0;
    totalProgramsAchieved += parseInt(pr.achieved) || 0;
    totalProgramsParticipants += parseInt(pr.participants) || 0;

    totalBooksTarget += parseInt(dp.books_target) || 0;
    totalBooksAchieved += parseInt(dp.books_achieved) || 0;
    totalLeafletTarget += parseInt(dp.leaflet_target) || 0;
    totalLeafletAchieved += parseInt(dp.leaflet_achieved) || 0;
    totalPaperTarget += parseInt(dp.paper_target) || 0;
    totalPaperAchieved += parseInt(dp.paper_achieved) || 0;

    totalChandaTarget += parseFloat(bm.chanda_target) || 0;
    totalChandaAchieved += parseFloat(bm.chanda_achieved) || 0;
    totalSpecialTarget += parseFloat(bm.special_target) || 0;
    totalSpecialAchieved += parseFloat(bm.special_achieved) || 0;
  }

  const totalManpower = totalRukonCurr + totalKormiCurr + totalSathiCurr + totalSupCurr;

  // Manpower totals
  output = output.replace(/{{total_rukon_prev}}/g, String(totalRukonPrev));
  output = output.replace(/{{total_rukon_current}}/g, String(totalRukonCurr));
  output = output.replace(/{{total_kormi_prev}}/g, String(totalKormiPrev));
  output = output.replace(/{{total_kormi_current}}/g, String(totalKormiCurr));
  output = output.replace(/{{total_sathi_prev}}/g, String(totalSathiPrev));
  output = output.replace(/{{total_sathi_current}}/g, String(totalSathiCurr));
  output = output.replace(/{{total_supporter_prev}}/g, String(totalSupPrev));
  output = output.replace(/{{total_supporter_current}}/g, String(totalSupCurr));
  output = output.replace(/{{total_manpower}}/g, String(totalManpower));

  // Dawat totals
  output = output.replace(/{{total_group_target}}/g, String(totalGroupTarget));
  output = output.replace(/{{total_group_achieved}}/g, String(totalGroupAchieved));
  output = output.replace(/{{total_new_target}}/g, String(totalNewTarget));
  output = output.replace(/{{total_new_achieved}}/g, String(totalNewAchieved));
  output = output.replace(/{{total_sathi_target}}/g, String(totalSathiTarget));
  output = output.replace(/{{total_sathi_achieved}}/g, String(totalSathiAchieved));
  output = output.replace(/{{total_kormi_target}}/g, String(totalKormiTarget));
  output = output.replace(/{{total_kormi_achieved}}/g, String(totalKormiAchieved));

  // Meeting totals
  output = output.replace(/{{total_general_target}}/g, String(totalGeneralTarget));
  output = output.replace(/{{total_general_held}}/g, String(totalGeneralHeld));
  output = output.replace(/{{total_general_attendance}}/g, String(totalGeneralAttendance));
  output = output.replace(/{{total_executive_target}}/g, String(totalExecTarget));
  output = output.replace(/{{total_executive_held}}/g, String(totalExecHeld));
  output = output.replace(/{{total_executive_attendance}}/g, String(totalExecAttendance));
  output = output.replace(/{{total_workers_target}}/g, String(totalWorkersTarget));
  output = output.replace(/{{total_workers_held}}/g, String(totalWorkersHeld));
  output = output.replace(/{{total_workers_attendance}}/g, String(totalWorkersAttendance));

  // Program totals
  output = output.replace(/{{total_programs_target}}/g, String(totalProgramsTarget));
  output = output.replace(/{{total_programs_achieved}}/g, String(totalProgramsAchieved));
  output = output.replace(/{{total_programs_participants}}/g, String(totalProgramsParticipants));

  // Publication totals
  output = output.replace(/{{total_books_target}}/g, String(totalBooksTarget));
  output = output.replace(/{{total_books_achieved}}/g, String(totalBooksAchieved));
  output = output.replace(/{{total_leaflet_target}}/g, String(totalLeafletTarget));
  output = output.replace(/{{total_leaflet_achieved}}/g, String(totalLeafletAchieved));
  output = output.replace(/{{total_paper_target}}/g, String(totalPaperTarget));
  output = output.replace(/{{total_paper_achieved}}/g, String(totalPaperAchieved));

  // Finance totals
  output = output.replace(/{{total_chanda_target}}/g, String(totalChandaTarget));
  output = output.replace(/{{total_chanda_achieved}}/g, String(totalChandaAchieved));
  output = output.replace(/{{total_special_target}}/g, String(totalSpecialTarget));
  output = output.replace(/{{total_special_achieved}}/g, String(totalSpecialAchieved));
  output = output.replace(/{{total_finance_target}}/g, String(totalChandaTarget + totalSpecialTarget));
  output = output.replace(/{{total_finance_achieved}}/g, String(totalChandaAchieved + totalSpecialAchieved));

  // Thana-level activities
  const ta = data.orgMeetings ?? {};
  const tr = data.training ?? {};
  const sw = data.socialWork ?? {};
  const misc = data.miscellaneous ?? data.remarks ?? {};

  output = output.replace(/{{thana_general_meeting_target}}/g, safeVal(ta.general_target, '০'));
  output = output.replace(/{{thana_general_meeting_held}}/g, safeVal(ta.general_held, '০'));
  output = output.replace(/{{thana_general_meeting_attendance}}/g, safeVal(ta.general_attendance, '০'));
  output = output.replace(/{{thana_general_meeting_remarks}}/g, safeVal(ta.general_remarks, ''));
  output = output.replace(/{{thana_worker_conf_target}}/g, safeVal(ta.worker_conf_target, '০'));
  output = output.replace(/{{thana_worker_conf_held}}/g, safeVal(ta.worker_conf_held, '০'));
  output = output.replace(/{{thana_worker_conf_attendance}}/g, safeVal(ta.worker_conf_attendance, '০'));
  output = output.replace(/{{thana_worker_conf_remarks}}/g, safeVal(ta.worker_conf_remarks, ''));
  output = output.replace(/{{thana_executive_target}}/g, safeVal(ta.executive_target, '০'));
  output = output.replace(/{{thana_executive_held}}/g, safeVal(ta.executive_held, '০'));
  output = output.replace(/{{thana_executive_attendance}}/g, safeVal(ta.executive_attendance, '০'));
  output = output.replace(/{{thana_executive_remarks}}/g, safeVal(ta.executive_remarks, ''));
  output = output.replace(/{{thana_training_target}}/g, safeVal(tr.target, '০'));
  output = output.replace(/{{thana_training_held}}/g, safeVal(tr.held, '০'));
  output = output.replace(/{{thana_training_attendance}}/g, safeVal(tr.attendance, '০'));
  output = output.replace(/{{thana_training_remarks}}/g, safeVal(tr.remarks, ''));

  const swItems = Array.isArray(sw.items) ? sw.items : [];
  const swFirst = swItems[0] ?? {};
  output = output.replace(/{{thana_social_target}}/g, safeVal(swFirst.target, '০'));
  output = output.replace(/{{thana_social_held}}/g, safeVal(swFirst.held ?? swFirst.achieved, '০'));
  output = output.replace(/{{thana_social_participants}}/g, safeVal(swFirst.participants, '০'));
  output = output.replace(/{{thana_social_remarks}}/g, safeVal(swFirst.remarks, ''));

  output = output.replace(/{{miscellaneous_remarks}}/g, safeVal(misc.remarks ?? misc.text, ''));

  return output;
}

/**
 * Generate the HTML print page for planning-reporting.
 *
 * @param params - Query parameters from the print URL:
 *   orgId   - Organization ID
 *   year    - Report year
 *   month   - Report month (1–12)
 *   orglevel - 'ward' or 'thana' (defaults to 'ward')
 *   token   - Auth token for API access
 * @param data  - Report data fetched from the API
 * @returns     - Rendered HTML string ready for printing
 */
export function generatePrintPage(params: PrintPageParams, data: ReportData): string {
  const { month, year, orglevel } = params;

  const resolvedYear = year ?? String(new Date().getFullYear());
  const resolvedMonth = month ?? String(new Date().getMonth() + 1);

  if (orglevel === 'thana') {
    return renderThanaTemplate(data, resolvedMonth, resolvedYear);
  }

  return renderWardTemplate(data, resolvedMonth, resolvedYear);
}
