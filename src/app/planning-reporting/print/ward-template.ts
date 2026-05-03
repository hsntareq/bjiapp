export function getWardTemplate(): string {
  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ওয়ার্ড মাসিক পরিকল্পনা ও রিপোর্ট</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Kalpurush', 'SolaimanLipi', 'Noto Sans Bengali', Arial, sans-serif;
      font-size: 11px;
      color: #000;
      background: #fff;
    }
    @page { size: A4; margin: 1cm; }
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 8mm;
      background: #fff;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .header h1 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 2px;
    }
    .header h2 {
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 2px;
    }
    .header p {
      font-size: 11px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 11px;
    }
    .meta-row span { display: inline-block; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
      font-size: 10.5px;
    }
    table th, table td {
      border: 1px solid #000;
      padding: 3px 5px;
      text-align: center;
      vertical-align: middle;
    }
    table th {
      background-color: #e8e8e8;
      font-weight: bold;
    }
    table td.left { text-align: left; }
    .section-title {
      font-size: 11.5px;
      font-weight: bold;
      background-color: #d0d0d0;
      border: 1px solid #000;
      padding: 3px 6px;
      margin-bottom: 0;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding-top: 10px;
    }
    .signature-box {
      text-align: center;
      width: 30%;
    }
    .signature-line {
      border-top: 1px solid #000;
      margin-top: 30px;
      padding-top: 4px;
      font-size: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 10px;
      font-size: 10px;
      color: #333;
      border-top: 1px solid #ccc;
      padding-top: 4px;
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <h1>বাংলাদেশ জামায়াতে ইসলামী</h1>
    <h2>{{orgName}}</h2>
    <p>মাসিক পরিকল্পনা ও রিপোর্ট &mdash; {{month}}, {{year}}</p>
  </div>

  <!-- Meta Info -->
  <div class="meta-row">
    <span>থানা: <strong>{{thanaName}}</strong></span>
    <span>ওয়ার্ড: <strong>{{wardNumber}}</strong></span>
    <span>জমাদানের তারিখ: <strong>{{submittedDate}}</strong></span>
  </div>

  <!-- 1. Manpower Section -->
  <div class="section-title">১. জনশক্তির তথ্য</div>
  <table>
    <thead>
      <tr>
        <th>ক্রমিক</th>
        <th>বিভাগ</th>
        <th>পূর্ববর্তী মাসের সংখ্যা</th>
        <th>এ মাসে বৃদ্ধি</th>
        <th>এ মাসে হ্রাস</th>
        <th>বর্তমান সংখ্যা</th>
        <th>মন্তব্য</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>১</td>
        <td class="left">রুকন</td>
        <td>{{manpower_rukon_prev}}</td>
        <td>{{manpower_rukon_increase}}</td>
        <td>{{manpower_rukon_decrease}}</td>
        <td>{{manpower_rukon_current}}</td>
        <td>{{manpower_rukon_remarks}}</td>
      </tr>
      <tr>
        <td>২</td>
        <td class="left">কর্মী</td>
        <td>{{manpower_kormi_prev}}</td>
        <td>{{manpower_kormi_increase}}</td>
        <td>{{manpower_kormi_decrease}}</td>
        <td>{{manpower_kormi_current}}</td>
        <td>{{manpower_kormi_remarks}}</td>
      </tr>
      <tr>
        <td>৩</td>
        <td class="left">সাথী</td>
        <td>{{manpower_sathi_prev}}</td>
        <td>{{manpower_sathi_increase}}</td>
        <td>{{manpower_sathi_decrease}}</td>
        <td>{{manpower_sathi_current}}</td>
        <td>{{manpower_sathi_remarks}}</td>
      </tr>
      <tr>
        <td>৪</td>
        <td class="left">সমর্থক</td>
        <td>{{manpower_supporter_prev}}</td>
        <td>{{manpower_supporter_increase}}</td>
        <td>{{manpower_supporter_decrease}}</td>
        <td>{{manpower_supporter_current}}</td>
        <td>{{manpower_supporter_remarks}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 2. Unit Dawat Section -->
  <div class="section-title">২. ইউনিট নিয়মিত গ্রুপভিত্তিক দাওয়াত</div>
  <table>
    <thead>
      <tr>
        <th>ক্রমিক</th>
        <th>বিষয়</th>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
        <th>মন্তব্য</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>১</td>
        <td class="left">গ্রুপ বৈঠকের সংখ্যা</td>
        <td>{{unitdawat_group_target}}</td>
        <td>{{unitdawat_group_achieved}}</td>
        <td>{{unitdawat_group_remarks}}</td>
      </tr>
      <tr>
        <td>২</td>
        <td class="left">উপস্থিতির সংখ্যা</td>
        <td>{{unitdawat_attendance_target}}</td>
        <td>{{unitdawat_attendance_achieved}}</td>
        <td>{{unitdawat_attendance_remarks}}</td>
      </tr>
      <tr>
        <td>৩</td>
        <td class="left">নতুন যোগদানকারী</td>
        <td>{{unitdawat_new_target}}</td>
        <td>{{unitdawat_new_achieved}}</td>
        <td>{{unitdawat_new_remarks}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 3. Personal Dawat Section -->
  <div class="section-title">৩. রুকন ও কর্মীভিত্তিক দাওয়াত</div>
  <table>
    <thead>
      <tr>
        <th>ক্রমিক</th>
        <th>বিষয়</th>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
        <th>মন্তব্য</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>১</td>
        <td class="left">যোগাযোগকৃত ব্যক্তি</td>
        <td>{{dawat_contacts_target}}</td>
        <td>{{dawat_contacts_achieved}}</td>
        <td>{{dawat_contacts_remarks}}</td>
      </tr>
      <tr>
        <td>২</td>
        <td class="left">সাথী উন্নীতকরণ</td>
        <td>{{dawat_sathi_target}}</td>
        <td>{{dawat_sathi_achieved}}</td>
        <td>{{dawat_sathi_remarks}}</td>
      </tr>
      <tr>
        <td>৩</td>
        <td class="left">কর্মী উন্নীতকরণ</td>
        <td>{{dawat_kormi_target}}</td>
        <td>{{dawat_kormi_achieved}}</td>
        <td>{{dawat_kormi_remarks}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 4. General Meetings -->
  <div class="section-title">৪. সাধারণ সভা ও সাংগঠনিক বৈঠক</div>
  <table>
    <thead>
      <tr>
        <th>ক্রমিক</th>
        <th>বৈঠকের ধরন</th>
        <th>পরিকল্পনা</th>
        <th>অনুষ্ঠিত</th>
        <th>উপস্থিতি</th>
        <th>মন্তব্য</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>১</td>
        <td class="left">সাধারণ সভা</td>
        <td>{{meeting_general_target}}</td>
        <td>{{meeting_general_held}}</td>
        <td>{{meeting_general_attendance}}</td>
        <td>{{meeting_general_remarks}}</td>
      </tr>
      <tr>
        <td>২</td>
        <td class="left">কার্যকরী পরিষদ</td>
        <td>{{meeting_executive_target}}</td>
        <td>{{meeting_executive_held}}</td>
        <td>{{meeting_executive_attendance}}</td>
        <td>{{meeting_executive_remarks}}</td>
      </tr>
      <tr>
        <td>৩</td>
        <td class="left">কর্মী সভা</td>
        <td>{{meeting_workers_target}}</td>
        <td>{{meeting_workers_held}}</td>
        <td>{{meeting_workers_attendance}}</td>
        <td>{{meeting_workers_remarks}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 5. Programs -->
  <div class="section-title">৫. কর্মসূচি বাস্তবায়ন</div>
  <table>
    <thead>
      <tr>
        <th>ক্রমিক</th>
        <th>কর্মসূচির বিবরণ</th>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
        <th>অংশগ্রহণকারী</th>
        <th>মন্তব্য</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>১</td>
        <td class="left">{{program_1_name}}</td>
        <td>{{program_1_target}}</td>
        <td>{{program_1_achieved}}</td>
        <td>{{program_1_participants}}</td>
        <td>{{program_1_remarks}}</td>
      </tr>
      <tr>
        <td>২</td>
        <td class="left">{{program_2_name}}</td>
        <td>{{program_2_target}}</td>
        <td>{{program_2_achieved}}</td>
        <td>{{program_2_participants}}</td>
        <td>{{program_2_remarks}}</td>
      </tr>
      <tr>
        <td>৩</td>
        <td class="left">{{program_3_name}}</td>
        <td>{{program_3_target}}</td>
        <td>{{program_3_achieved}}</td>
        <td>{{program_3_participants}}</td>
        <td>{{program_3_remarks}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 6. Publication & Dawah -->
  <div class="section-title">৬. প্রচার ও প্রকাশনা</div>
  <table>
    <thead>
      <tr>
        <th>ক্রমিক</th>
        <th>বিষয়</th>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
        <th>মন্তব্য</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>১</td>
        <td class="left">বই বিতরণ</td>
        <td>{{pub_books_target}}</td>
        <td>{{pub_books_achieved}}</td>
        <td>{{pub_books_remarks}}</td>
      </tr>
      <tr>
        <td>২</td>
        <td class="left">লিফলেট বিতরণ</td>
        <td>{{pub_leaflet_target}}</td>
        <td>{{pub_leaflet_achieved}}</td>
        <td>{{pub_leaflet_remarks}}</td>
      </tr>
      <tr>
        <td>৩</td>
        <td class="left">পত্রিকা বিতরণ</td>
        <td>{{pub_paper_target}}</td>
        <td>{{pub_paper_achieved}}</td>
        <td>{{pub_paper_remarks}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 7. Finance (Baitulmal) -->
  <div class="section-title">৭. বাইতুলমাল</div>
  <table>
    <thead>
      <tr>
        <th>ক্রমিক</th>
        <th>বিষয়</th>
        <th>পরিকল্পনা (টাকা)</th>
        <th>আদায় (টাকা)</th>
        <th>মন্তব্য</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>১</td>
        <td class="left">চাঁদা আদায়</td>
        <td>{{finance_chanda_target}}</td>
        <td>{{finance_chanda_achieved}}</td>
        <td>{{finance_chanda_remarks}}</td>
      </tr>
      <tr>
        <td>২</td>
        <td class="left">বিশেষ তহবিল</td>
        <td>{{finance_special_target}}</td>
        <td>{{finance_special_achieved}}</td>
        <td>{{finance_special_remarks}}</td>
      </tr>
      <tr>
        <td>৩</td>
        <td class="left">মোট</td>
        <td><strong>{{finance_total_target}}</strong></td>
        <td><strong>{{finance_total_achieved}}</strong></td>
        <td>{{finance_total_remarks}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 8. Social Work -->
  <div class="section-title">৮. সমাজসেবামূলক কার্যক্রম</div>
  <table>
    <thead>
      <tr>
        <th>ক্রমিক</th>
        <th>কার্যক্রমের বিবরণ</th>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
        <th>মন্তব্য</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>১</td>
        <td class="left">{{social_1_name}}</td>
        <td>{{social_1_target}}</td>
        <td>{{social_1_achieved}}</td>
        <td>{{social_1_remarks}}</td>
      </tr>
      <tr>
        <td>২</td>
        <td class="left">{{social_2_name}}</td>
        <td>{{social_2_target}}</td>
        <td>{{social_2_achieved}}</td>
        <td>{{social_2_remarks}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 9. Miscellaneous / Remarks -->
  <div class="section-title">৯. বিবিধ ও মন্তব্য</div>
  <table>
    <tbody>
      <tr>
        <td class="left" style="height:60px; vertical-align:top; padding:6px;">{{miscellaneous_remarks}}</td>
      </tr>
    </tbody>
  </table>

  <!-- Signatures -->
  <div class="signatures">
    <div class="signature-box">
      <div class="signature-line">
        ইউনিট সম্পাদক<br/>{{orgName}}
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-line">
        ইউনিট সভাপতি<br/>{{orgName}}
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-line">
        ওয়ার্ড সম্পাদক<br/>{{wardName}}
      </div>
    </div>
  </div>

  <div class="footer">
    রিপোর্ট তৈরির তারিখ: {{generatedDate}} &nbsp;|&nbsp; মাস: {{month}}, {{year}}
  </div>

</div>
</body>
</html>`;
}
