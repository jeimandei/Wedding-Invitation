/**
 * SETUP INSTRUCTIONS
 * ──────────────────
 * 1. Open the Google Sheet:
 *    https://docs.google.com/spreadsheets/d/1d6gkH9MYtP8nxSwqBJf1_WmWUu_V31hfmIXNuG4E81o
 *
 * 2. Rename the first tab to "RSVP".
 *
 * 3. Add two new tabs:
 *    • "Guests"  → columns: id | name | table | phone | pax
 *      Fill B–E (name, table, phone, pax). Leave column A blank.
 *    • "Scans"   → columns: scanned_at | guest_id | guest_name | table | pax
 *      Leave completely empty.
 *
 * 4. Share the spreadsheet: "Anyone with the link → Viewer"
 *    (required so the Guests / Scans tabs can be read via the gviz API).
 *
 * 5. Go to Extensions → Apps Script, paste this full file, save.
 *
 * 6. Run generateIds() once (▶ button while that function is selected).
 *    This auto-fills column A of the Guests tab from the names in column B.
 *
 * 7. Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    → Copy the Web App URL.
 *
 * 8. The URL is already set in js/script.js as APPS_SCRIPT_URL.
 *    welcome.html, guestbook.html, and admin.html read it from there —
 *    no other files need changing.
 *
 * Sheet columns:
 *   RSVP:   Timestamp | Guest Name | Attendance | Guests | Message
 *   Guests: id (auto) | name       | table      | phone  | pax
 *   Scans:  scanned_at | guest_id  | guest_name | table  | pax
 */

const SPREADSHEET_ID = '1d6gkH9MYtP8nxSwqBJf1_WmWUu_V31hfmIXNuG4E81o';
const SALT           = 'ShadowRubyAsh120122';
const TZ             = 'Asia/Makassar';

/* ─── Hash name → 16-char hex (identical to client-side SHA-256) ─── */
function hashName(name) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    name + SALT,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function(b) {
    return (b < 0 ? b + 256 : b).toString(16).padStart(2, '0');
  }).join('').slice(0, 16);
}

/* ─── Run once from the Apps Script editor to populate Guests.id ─── */
function generateIds() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Guests');
  if (!sheet) { Logger.log('Guests sheet not found'); return; }

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) { Logger.log('No guest rows found (start from row 2)'); return; }

  var names = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  var count = 0;
  for (var i = 0; i < names.length; i++) {
    var name = String(names[i][0]).trim();
    if (name) {
      sheet.getRange(i + 2, 1).setValue(hashName(name));
      count++;
    }
  }
  Logger.log('Generated ' + count + ' IDs in Guests sheet.');
}

/* ─── POST router ─── */
function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  if (data.action === 'scan')        return handleScan(data);
  if (data.action === 'generateIds') return runGenerateIds();

  return handleRsvp(data);
}

/* ─── RSVP write (existing behaviour, now also writes to Guests) ─── */
function handleRsvp(data) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('RSVP') || ss.getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Guest Name', 'Attendance', 'Guests', 'Message']);
  }

  sheet.appendRow([
    new Date().toLocaleString('id-ID', { timeZone: TZ }),
    data.guestName  || '',
    data.attendance || '',
    data.guests     || '',
    data.message    || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ─── Scan event write (called from welcome.html) ─── */
function handleScan(data) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Scans');
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Scans sheet not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['scanned_at', 'guest_id', 'guest_name', 'table', 'pax']);
  }

  sheet.appendRow([
    new Date().toLocaleString('id-ID', { timeZone: TZ }),
    data.guest_id   || '',
    data.guest_name || '',
    data.table      || '',
    data.pax        || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ─── Trigger generateIds via HTTP (called from admin.html) ─── */
function runGenerateIds() {
  generateIds();
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
