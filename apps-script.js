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
 *    • "Gifts"   is created automatically the first time you run
 *      "Generate Unique Codes" from the admin panel — no manual setup
 *      needed. Holds a stable, append-only guest_id → unique_code
 *      mapping (0–850) the couple uses to reconcile incoming
 *      QRIS/transfer payments against the trailing digits of the
 *      amount a guest was asked to send.
 *    • "Config"  is created automatically the first time you save a
 *      setting (e.g. the live stream link) from the admin panel — no
 *      manual setup needed. Simple key/value store read by index.html.
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
 *   Gifts:  guest_id (auto) | guest_name | unique_code
 *   Config: key | value
 */

const SPREADSHEET_ID = '1d6gkH9MYtP8nxSwqBJf1_WmWUu_V31hfmIXNuG4E81o';
const SALT           = 'ShadowRubyAsh120122';
const TZ             = 'Asia/Makassar';

/* ─── Hash name → 16-char hex (identical to client-side SHA-256) ─── */
function hashName(name) {
  var normalized = String(name).trim().toLowerCase();
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    normalized + SALT,
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

  if (data.action === 'scan')          return handleScan(data);
  if (data.action === 'generateIds')   return runGenerateIds();
  if (data.action === 'resetScans')    return handleResetScans();
  if (data.action === 'resetRsvp')     return handleResetRsvp();
  if (data.action === 'resetAll')      return handleResetAll();
  if (data.action === 'importGuests')  return handleImportGuests(data);
  if (data.action === 'generateCodes') return runGenerateCodes();
  if (data.action === 'resetGifts')    return handleResetGifts();
  if (data.action === 'setLivestream') return runSetLivestream(data);

  return handleRsvp(data);
}

/* ─── RSVP write ─── */
function handleRsvp(data) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('RSVP') || ss.getActiveSheet();

  // Cross-check name against Guests sheet to flag unlisted submissions
  var guestsSheet = ss.getSheetByName('Guests');
  var listed = 'NO';
  if (guestsSheet && guestsSheet.getLastRow() > 1) {
    var guestNames = guestsSheet.getRange(2, 2, guestsSheet.getLastRow() - 1, 1).getValues();
    var normalized = String(data.guestName || '').trim().toLowerCase();
    listed = guestNames.some(function(row) {
      return String(row[0]).trim().toLowerCase() === normalized;
    }) ? 'YES' : 'NO';
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Guest Name', 'Attendance', 'Guests', 'Message', 'Listed']);
  }

  sheet.appendRow([
    new Date().toLocaleString('id-ID', { timeZone: TZ }),
    data.guestName  || '',
    data.attendance || '',
    data.guests     || '',
    data.message    || '',
    listed
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
    sheet.appendRow(['scanned_at', 'guest_id', 'guest_name', 'table', 'pax', 'gift_tag']);
  }

  sheet.appendRow([
    new Date().toLocaleString('id-ID', { timeZone: TZ }),
    data.guest_id   || '',
    data.guest_name || '',
    data.table      || '',
    data.pax        || '',
    data.gift_tag   || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ─── Reset Scans sheet (keeps header row) ─── */
function handleResetScans() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Scans');
  if (sheet && sheet.getLastRow() > 1)
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ─── Reset RSVP sheet (keeps header row) ─── */
function handleResetRsvp() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('RSVP') || ss.getActiveSheet();
  if (sheet && sheet.getLastRow() > 1)
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ─── Reset Scans, RSVP, Guests and Gifts sheets in one call ─── */
function handleResetAll() {
  var ss     = SpreadsheetApp.openById(SPREADSHEET_ID);
  var scans  = ss.getSheetByName('Scans');
  var rsvp   = ss.getSheetByName('RSVP') || ss.getActiveSheet();
  var guests = ss.getSheetByName('Guests');
  var gifts  = ss.getSheetByName('Gifts');
  if (scans  && scans.getLastRow()  > 1) scans.deleteRows(2,  scans.getLastRow()  - 1);
  if (rsvp   && rsvp.getLastRow()   > 1) rsvp.deleteRows(2,   rsvp.getLastRow()   - 1);
  if (guests && guests.getLastRow() > 1) guests.deleteRows(2, guests.getLastRow() - 1);
  if (gifts  && gifts.getLastRow()  > 1) gifts.deleteRows(2,  gifts.getLastRow()  - 1);
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ─── Assign unique gift-tracking codes (0–850) to guests ───
   Append-only and stable: a guest who already has a code keeps it
   forever, regardless of how the Guests sheet is later reordered or
   added to. Only guests without a code yet get the next unused
   number. Run from admin.html's "Generate Unique Codes" button
   whenever the guest list changes. */
function generateUniqueCodes() {
  var ss           = SpreadsheetApp.openById(SPREADSHEET_ID);
  var guestsSheet  = ss.getSheetByName('Guests');
  var giftsSheet   = ss.getSheetByName('Gifts') || ss.insertSheet('Gifts');
  var MAX_CODE     = 850;

  if (giftsSheet.getLastRow() === 0) {
    giftsSheet.appendRow(['guest_id', 'guest_name', 'unique_code']);
  }

  var existing = giftsSheet.getLastRow() > 1
    ? giftsSheet.getRange(2, 1, giftsSheet.getLastRow() - 1, 3).getValues()
    : [];
  var assignedIds = {};
  var usedCodes   = {};
  existing.forEach(function(row) {
    var gid  = String(row[0]).trim();
    var code = row[2];
    if (gid) assignedIds[gid] = true;
    if (code !== '' && code != null) usedCodes[Math.round(Number(code))] = true;
  });

  var nextCode = 0;
  function takeNextCode() {
    while (usedCodes[nextCode] && nextCode <= MAX_CODE) nextCode++;
    if (nextCode > MAX_CODE) throw new Error('Unique code pool exhausted (' + MAX_CODE + ' max)');
    usedCodes[nextCode] = true;
    return nextCode;
  }

  if (!guestsSheet || guestsSheet.getLastRow() < 2) return 0;
  var guestRows = guestsSheet.getRange(2, 1, guestsSheet.getLastRow() - 1, 2).getValues(); // id, name
  var newRows = [];
  guestRows.forEach(function(row) {
    var gid  = String(row[0]).trim();
    var name = String(row[1]).trim();
    if (!gid || !name || assignedIds[gid]) return; // skip blank/ungenerated-id rows and already-assigned guests
    newRows.push([gid, name, takeNextCode()]);
    assignedIds[gid] = true;
  });

  if (newRows.length) {
    giftsSheet.getRange(giftsSheet.getLastRow() + 1, 1, newRows.length, 3).setValues(newRows);
  }
  return newRows.length;
}

/* ─── Trigger generateUniqueCodes via HTTP (called from admin.html) ─── */
function runGenerateCodes() {
  var count = generateUniqueCodes();
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success', assigned: count }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ─── Reset Gifts sheet (keeps header row) ─── */
function handleResetGifts() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Gifts');
  if (sheet && sheet.getLastRow() > 1)
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ─── Import guest list (replaces Guests sheet rows, auto-generates IDs) ─── */
function handleImportGuests(data) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Guests');
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Guests sheet not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Clear existing data rows, keep header
  if (sheet.getLastRow() < 1)
    sheet.appendRow(['id', 'name', 'table', 'phone', 'pax']);
  if (sheet.getLastRow() > 1)
    sheet.deleteRows(2, sheet.getLastRow() - 1);

  // Write new rows (id left blank — generateIds fills it)
  var guests = data.guests || [];
  guests.forEach(function(g) {
    sheet.appendRow(['', g.name || '', g.table || '', g.phone || '', g.pax || '']);
  });

  // Auto-generate IDs for all new rows
  generateIds();

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success', count: guests.length }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ─── Trigger generateIds via HTTP (called from admin.html) ─── */
function runGenerateIds() {
  generateIds();
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ─── Simple key/value config store, read by index.html via gviz ───
   Used for site-wide settings (currently just the live stream link)
   that every guest's page needs, not just the admin's own browser. */
function setConfigValue(key, value) {
  var ss     = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet  = ss.getSheetByName('Config') || ss.insertSheet('Config');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['key', 'value']);
  }

  var lastRow = sheet.getLastRow();
  var rowIndex = -1;
  if (lastRow > 1) {
    var keys = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < keys.length; i++) {
      if (String(keys[i][0]).trim() === key) { rowIndex = i + 2; break; }
    }
  }

  if (rowIndex > -1) sheet.getRange(rowIndex, 2).setValue(value);
  else sheet.appendRow([key, value]);
}

/* ─── Save the live stream link (called from admin.html) ─── */
function runSetLivestream(data) {
  setConfigValue('livestream_url', data.url || '');
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
