export function getThanaTemplate(): string {
  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>থানা মাসিক পরিকল্পনা ও রিপোর্ট</title>
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
    table tr.ward-total td {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .section-title {
      font-size: 11.5px;
      font-weight: bold;
      background-color: #d0d0d0;
      border: 1px solid #000;
      padding: 3px 6px;
      margin-bottom: 0;
    }
    .subsection-title {
      font-size: 11px;
      font-weight: bold;
      background-color: #ebebeb;
      border: 1px solid #000;
      border-top: none;
      padding: 2px 6px;
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
    <h2>{{thanaName}} থানা</h2>
    <p>মাসিক পরিকল্পনা ও রিপোর্ট &mdash; {{month}}, {{year}}</p>
  </div>

  <!-- Meta Info -->
  <div class="meta-row">
    <span>থানা: <strong>{{thanaName}}</strong></span>
    <span>মোট ওয়ার্ড: <strong>{{totalWards}}</strong></span>
    <span>জমাদানের তারিখ: <strong>{{submittedDate}}</strong></span>
  </div>

  <!-- 1. Manpower Summary by Ward -->
  <div class="section-title">১. ওয়ার্ডভিত্তিক জনশক্তির তথ্য</div>
  <table>
    <thead>
      <tr>
        <th rowspan="2">ওয়ার্ড</th>
        <th colspan="2">রুকন</th>
        <th colspan="2">কর্মী</th>
        <th colspan="2">সাথী</th>
        <th colspan="2">সমর্থক</th>
        <th rowspan="2">মোট জনশক্তি</th>
      </tr>
      <tr>
        <th>পূর্ব</th>
        <th>বর্তমান</th>
        <th>পূর্ব</th>
        <th>বর্তমান</th>
        <th>পূর্ব</th>
        <th>বর্তমান</th>
        <th>পূর্ব</th>
        <th>বর্তমান</th>
      </tr>
    </thead>
    <tbody>
      {{ward_manpower_rows}}
      <tr class="ward-total">
        <td class="left">মোট</td>
        <td>{{total_rukon_prev}}</td>
        <td>{{total_rukon_current}}</td>
        <td>{{total_kormi_prev}}</td>
        <td>{{total_kormi_current}}</td>
        <td>{{total_sathi_prev}}</td>
        <td>{{total_sathi_current}}</td>
        <td>{{total_supporter_prev}}</td>
        <td>{{total_supporter_current}}</td>
        <td>{{total_manpower}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 2. Dawat Summary by Ward -->
  <div class="section-title">২. দাওয়াতী কার্যক্রম (ওয়ার্ডভিত্তিক)</div>
  <table>
    <thead>
      <tr>
        <th rowspan="2">ওয়ার্ড</th>
        <th colspan="2">গ্রুপ বৈঠক</th>
        <th colspan="2">নতুন যোগদান</th>
        <th colspan="2">সাথী উন্নীতকরণ</th>
        <th colspan="2">কর্মী উন্নীতকরণ</th>
      </tr>
      <tr>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
      </tr>
    </thead>
    <tbody>
      {{ward_dawat_rows}}
      <tr class="ward-total">
        <td class="left">মোট</td>
        <td>{{total_group_target}}</td>
        <td>{{total_group_achieved}}</td>
        <td>{{total_new_target}}</td>
        <td>{{total_new_achieved}}</td>
        <td>{{total_sathi_target}}</td>
        <td>{{total_sathi_achieved}}</td>
        <td>{{total_kormi_target}}</td>
        <td>{{total_kormi_achieved}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 3. Meetings Summary by Ward -->
  <div class="section-title">৩. সভা ও বৈঠক (ওয়ার্ডভিত্তিক)</div>
  <table>
    <thead>
      <tr>
        <th rowspan="2">ওয়ার্ড</th>
        <th colspan="3">সাধারণ সভা</th>
        <th colspan="3">কার্যকরী পরিষদ</th>
        <th colspan="3">কর্মী সভা</th>
      </tr>
      <tr>
        <th>পরিকল্পনা</th>
        <th>অনুষ্ঠিত</th>
        <th>উপস্থিতি</th>
        <th>পরিকল্পনা</th>
        <th>অনুষ্ঠিত</th>
        <th>উপস্থিতি</th>
        <th>পরিকল্পনা</th>
        <th>অনুষ্ঠিত</th>
        <th>উপস্থিতি</th>
      </tr>
    </thead>
    <tbody>
      {{ward_meeting_rows}}
      <tr class="ward-total">
        <td class="left">মোট</td>
        <td>{{total_general_target}}</td>
        <td>{{total_general_held}}</td>
        <td>{{total_general_attendance}}</td>
        <td>{{total_executive_target}}</td>
        <td>{{total_executive_held}}</td>
        <td>{{total_executive_attendance}}</td>
        <td>{{total_workers_target}}</td>
        <td>{{total_workers_held}}</td>
        <td>{{total_workers_attendance}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 4. Programs Summary by Ward -->
  <div class="section-title">৪. কর্মসূচি বাস্তবায়ন (ওয়ার্ডভিত্তিক)</div>
  <table>
    <thead>
      <tr>
        <th>ওয়ার্ড</th>
        <th>পরিকল্পিত কর্মসূচি</th>
        <th>বাস্তবায়িত কর্মসূচি</th>
        <th>মোট অংশগ্রহণকারী</th>
        <th>মন্তব্য</th>
      </tr>
    </thead>
    <tbody>
      {{ward_program_rows}}
      <tr class="ward-total">
        <td class="left">মোট</td>
        <td>{{total_programs_target}}</td>
        <td>{{total_programs_achieved}}</td>
        <td>{{total_programs_participants}}</td>
        <td></td>
      </tr>
    </tbody>
  </table>

  <!-- 5. Publications -->
  <div class="section-title">৫. প্রচার ও প্রকাশনা (ওয়ার্ডভিত্তিক)</div>
  <table>
    <thead>
      <tr>
        <th rowspan="2">ওয়ার্ড</th>
        <th colspan="2">বই বিতরণ</th>
        <th colspan="2">লিফলেট বিতরণ</th>
        <th colspan="2">পত্রিকা বিতরণ</th>
      </tr>
      <tr>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
      </tr>
    </thead>
    <tbody>
      {{ward_publication_rows}}
      <tr class="ward-total">
        <td class="left">মোট</td>
        <td>{{total_books_target}}</td>
        <td>{{total_books_achieved}}</td>
        <td>{{total_leaflet_target}}</td>
        <td>{{total_leaflet_achieved}}</td>
        <td>{{total_paper_target}}</td>
        <td>{{total_paper_achieved}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 6. Finance (Baitulmal) -->
  <div class="section-title">৬. বাইতুলমাল (ওয়ার্ডভিত্তিক)</div>
  <table>
    <thead>
      <tr>
        <th rowspan="2">ওয়ার্ড</th>
        <th colspan="2">চাঁদা আদায়</th>
        <th colspan="2">বিশেষ তহবিল</th>
        <th colspan="2">মোট</th>
      </tr>
      <tr>
        <th>পরিকল্পনা (টাকা)</th>
        <th>আদায় (টাকা)</th>
        <th>পরিকল্পনা (টাকা)</th>
        <th>আদায় (টাকা)</th>
        <th>পরিকল্পনা (টাকা)</th>
        <th>আদায় (টাকা)</th>
      </tr>
    </thead>
    <tbody>
      {{ward_finance_rows}}
      <tr class="ward-total">
        <td class="left">মোট</td>
        <td>{{total_chanda_target}}</td>
        <td>{{total_chanda_achieved}}</td>
        <td>{{total_special_target}}</td>
        <td>{{total_special_achieved}}</td>
        <td><strong>{{total_finance_target}}</strong></td>
        <td><strong>{{total_finance_achieved}}</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- 7. Thana-level Activities -->
  <div class="section-title">৭. থানা পর্যায়ের কার্যক্রম</div>
  <table>
    <thead>
      <tr>
        <th>ক্রমিক</th>
        <th>কার্যক্রমের বিবরণ</th>
        <th>পরিকল্পনা</th>
        <th>বাস্তবায়ন</th>
        <th>অংশগ্রহণকারী</th>
        <th>মন্তব্য</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>১</td>
        <td class="left">থানা সাধারণ সভা</td>
        <td>{{thana_general_meeting_target}}</td>
        <td>{{thana_general_meeting_held}}</td>
        <td>{{thana_general_meeting_attendance}}</td>
        <td>{{thana_general_meeting_remarks}}</td>
      </tr>
      <tr>
        <td>২</td>
        <td class="left">থানা কর্মী সম্মেলন</td>
        <td>{{thana_worker_conf_target}}</td>
        <td>{{thana_worker_conf_held}}</td>
        <td>{{thana_worker_conf_attendance}}</td>
        <td>{{thana_worker_conf_remarks}}</td>
      </tr>
      <tr>
        <td>৩</td>
        <td class="left">থানা কার্যকরী পরিষদ সভা</td>
        <td>{{thana_executive_target}}</td>
        <td>{{thana_executive_held}}</td>
        <td>{{thana_executive_attendance}}</td>
        <td>{{thana_executive_remarks}}</td>
      </tr>
      <tr>
        <td>৪</td>
        <td class="left">প্রশিক্ষণ কার্যক্রম</td>
        <td>{{thana_training_target}}</td>
        <td>{{thana_training_held}}</td>
        <td>{{thana_training_attendance}}</td>
        <td>{{thana_training_remarks}}</td>
      </tr>
      <tr>
        <td>৫</td>
        <td class="left">সমাজসেবামূলক কার্যক্রম</td>
        <td>{{thana_social_target}}</td>
        <td>{{thana_social_held}}</td>
        <td>{{thana_social_participants}}</td>
        <td>{{thana_social_remarks}}</td>
      </tr>
    </tbody>
  </table>

  <!-- 8. Miscellaneous / Remarks -->
  <div class="section-title">৮. বিবিধ ও মন্তব্য</div>
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
        থানা সম্পাদক<br/>{{thanaName}} থানা
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-line">
        থানা সভাপতি<br/>{{thanaName}} থানা
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-line">
        জেলা/সিটি প্রতিনিধি
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
