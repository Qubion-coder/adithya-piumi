/**
 * Wedding RSVP receiver for Adithya & Piumi.
 * Paste into Extensions > Apps Script of the RSVP spreadsheet, then Deploy > New deployment > Web app.
 */

const SPREADSHEET_ID = '1TbyrQ5dKvYW0xJJH3AJBe9P4zhzMupstMf9i5HfhKrE';
const SHEET_NAME = 'RSVP';
const TIME_ZONE = 'Asia/Colombo';

const HEADERS = [
  'Timestamp',
  'Name',
  'Attending',
  'Guest Count',
  'Wishes',
  'Invited As',
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const p = (e && e.parameter) || {};
    const sheet = getSheet_();
    const guests = Number(p.guests || 0);

    sheet.appendRow([
      Utilities.formatDate(new Date(), TIME_ZONE, 'yyyy-MM-dd HH:mm:ss'),
      clean_(p.name),
      guests > 0 ? 'ඔව් (Yes)' : 'නැත (No)',
      guests,
      clean_(p.message),
      clean_(p.invitedAs),
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the web app URL in a browser shows this, handy to confirm the deployment works.
function doGet() {
  getSheet_();
  return json_({ ok: true, message: 'RSVP endpoint is running' });
}

// Run once from the Apps Script editor to create the sheet and headers right away.
function setup() {
  getSheet_();
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#b98a2f')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 200);
    sheet.setColumnWidth(5, 360);
    sheet.setColumnWidth(6, 260);
    sheet.getRange('E:E').setWrap(true);
  }
  return sheet;
}

// Stop names like "=SUM(...)" from being treated as formulas.
function clean_(value) {
  const text = String(value || '').trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
