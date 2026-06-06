/**
 * SETUP INSTRUCTIONS
 * ──────────────────
 * 1. Open the Google Sheet:
 *    https://docs.google.com/spreadsheets/d/1d6gkH9MYtP8nxSwqBJf1_WmWUu_V31hfmIXNuG4E81o
 *
 * 2. Go to Extensions → Apps Script
 *
 * 3. Delete everything in the editor and paste the code below (starting at "function doPost").
 *
 * 4. Click Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    → Click Deploy, authorize when prompted, copy the Web App URL.
 *
 * 5. In js/script.js, replace 'YOUR_APPS_SCRIPT_URL' with the URL you just copied.
 *
 * 6. Make sure the Google Sheet is shared: "Anyone with the link can view"
 *    (so the Wishes section can read it without authentication).
 *
 * Sheet columns written by this script:
 *   A: Timestamp | B: Guest Name | C: Attendance | D: Guests | E: Message
 */

function doPost(e) {
  var sheet = SpreadsheetApp
    .openById('1d6gkH9MYtP8nxSwqBJf1_WmWUu_V31hfmIXNuG4E81o')
    .getActiveSheet();

  // Write header row if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Guest Name', 'Attendance', 'Guests', 'Message']);
  }

  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }),
    data.guestName   || '',
    data.attendance  || '',
    data.guests      || '',
    data.message     || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
