const SHEET_NAME = 'RSVP Responses';
const HEADERS = ['Submitted At', 'Guest or Family Name', 'Attendance', 'Message', 'Submission ID'];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('RsvpForm')
    .setTitle('Kim & Jiselle RSVP')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function submitRsvp(data) {
  if (!data || typeof data !== 'object') throw new Error('Please complete the RSVP form.');
  const name = String(data.name || '').trim();
  const attendance = String(data.attendance || '').trim();
  const message = String(data.message || '').trim();
  if (name.length < 2 || name.length > 100) throw new Error('Enter a name between 2 and 100 characters.');
  if (attendance !== 'Yes' && attendance !== 'No') throw new Error('Choose Yes or No.');
  if (message.length > 500) throw new Error('Keep your message under 500 characters.');
  if (data.website) throw new Error('Unable to save this response.'); // Hidden spam trap.

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('The RSVP sheet is not connected to this script.');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    const submissionId = Utilities.getUuid();
    sheet.appendRow([new Date(), safeCell_(name), attendance, safeCell_(message), submissionId]);
    SpreadsheetApp.flush();
    return { saved: true, submissionId: submissionId };
  } finally {
    lock.releaseLock();
  }
}

// Prevent a guest's text from being interpreted as a spreadsheet formula.
function safeCell_(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}