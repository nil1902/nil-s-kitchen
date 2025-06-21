// Google Apps Script Code for Restaurant Data Tracker
// Copy this code to your Google Apps Script project

// ============================================
// 1. AUTO-CALCULATE TOTAL PRICE IN ORDERS TAB
// ============================================

function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const sheetName = sheet.getName();

  // Only run on Orders sheet
  if (sheetName !== "Orders") return;

  const row = range.getRow();

  // Skip header row
  if (row === 1) return;

  // Check if Quantity (column D) or Price per Item (column E) was edited
  if (range.getColumn() === 4 || range.getColumn() === 5) {
    // Get quantity and price values
    const quantity = sheet.getRange(row, 4).getValue(); // Column D
    const pricePerItem = sheet.getRange(row, 5).getValue(); // Column E

    // Calculate total price
    if (quantity && pricePerItem && !isNaN(quantity) && !isNaN(pricePerItem)) {
      const totalPrice = quantity * pricePerItem;
      sheet.getRange(row, 6).setValue(totalPrice); // Column F (Total Price)

      // Format as currency
      sheet.getRange(row, 5).setNumberFormat("₹#,##0.00"); // Price per Item
      sheet.getRange(row, 6).setNumberFormat("₹#,##0.00"); // Total Price
    }
  }

  // Auto-fill Date and Time columns when Customer Name is entered
  if (range.getColumn() === 2 && range.getValue()) {
    // Customer Name column
    const now = new Date();
    sheet
      .getRange(row, 8)
      .setValue(
        Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd"),
      ); // Date (Column H)
    sheet
      .getRange(row, 9)
      .setValue(
        Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm:ss"),
      ); // Time (Column I)
  }
}

// ============================================
// 2. FORMAT CURRENCY COLUMNS ON SHEET OPEN
// ============================================

function onOpen() {
  formatCurrencyColumns();
  createCustomMenu();
}

function formatCurrencyColumns() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ordersSheet = ss.getSheetByName("Orders");

  if (ordersSheet) {
    // Format Price per Item column (E)
    const priceRange = ordersSheet.getRange("E:E");
    priceRange.setNumberFormat("₹#,##0.00");

    // Format Total Price column (F)
    const totalRange = ordersSheet.getRange("F:F");
    totalRange.setNumberFormat("₹#,##0.00");
  }

  // Format Billing sheet currency columns
  const billingSheet = ss.getSheetByName("Billing");
  if (billingSheet) {
    billingSheet.getRange("C:C").setNumberFormat("₹#,##0.00"); // Tax Amount
    billingSheet.getRange("D:D").setNumberFormat("₹#,##0.00"); // Discount
    billingSheet.getRange("E:E").setNumberFormat("₹#,##0.00"); // Final Amount
  }
}

// ============================================
// 3. CREATE CUSTOM MENU
// ============================================

function createCustomMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Restaurant Manager")
    .addItem("Export to Excel", "exportToExcel")
    .addItem("Email Daily Report", "emailDailyReport")
    .addItem("Format All Currency", "formatCurrencyColumns")
    .addItem("Backup Data", "backupData")
    .addToUi();
}

// ============================================
// 4. EXPORT TO EXCEL FUNCTIONALITY
// ============================================

function exportToExcel() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const url =
    "https://docs.google.com/spreadsheets/d/" +
    ss.getId() +
    "/export?format=xlsx";

  // Create a temporary link to download
  const ui = SpreadsheetApp.getUi();
  const htmlOutput = HtmlService.createHtmlOutput(
    "<p>Click the link below to download the Excel file:</p>" +
      '<a href="' +
      url +
      '" target="_blank">Download Restaurant Data.xlsx</a>' +
      '<script>window.open("' +
      url +
      '", "_blank"); google.script.host.close();</script>',
  )
    .setWidth(400)
    .setHeight(200);

  ui.showModalDialog(htmlOutput, "Export to Excel");
}

// ============================================
// 5. EMAIL DAILY REPORT
// ============================================

function emailDailyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const adminEmail = "nilimeshpal4@gmail.com"; // Change to your admin email

  try {
    // Create Excel export URL
    const url =
      "https://docs.google.com/spreadsheets/d/" +
      ss.getId() +
      "/export?format=xlsx";
    const response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: "Bearer " + ScriptApp.getOAuthToken(),
      },
    });

    const blob = response.getBlob();
    blob.setName(
      "Restaurant_Data_" +
        Utilities.formatDate(
          new Date(),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd",
        ) +
        ".xlsx",
    );

    // Get summary data
    const summary = generateDailySummary();

    // Send email with attachment
    MailApp.sendEmail({
      to: adminEmail,
      subject:
        "Daily Restaurant Data Report - " +
        Utilities.formatDate(
          new Date(),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd",
        ),
      body: summary,
      attachments: [blob],
    });

    SpreadsheetApp.getUi().alert(
      "Daily report sent successfully to " + adminEmail,
    );
  } catch (error) {
    SpreadsheetApp.getUi().alert("Error sending email: " + error.toString());
  }
}

function generateDailySummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const today = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd",
  );

  let summary = "Daily Restaurant Data Summary - " + today + "\n\n";

  // Orders summary
  const ordersSheet = ss.getSheetByName("Orders");
  if (ordersSheet) {
    const ordersData = ordersSheet.getDataRange().getValues();
    const todayOrders = ordersData.filter((row) => {
      if (row[7]) {
        // Date column
        const rowDate = Utilities.formatDate(
          new Date(row[7]),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd",
        );
        return rowDate === today;
      }
      return false;
    });

    const totalRevenue = todayOrders.reduce(
      (sum, row) => sum + (row[5] || 0),
      0,
    );

    summary += "ORDERS:\n";
    summary += "- Total Orders Today: " + todayOrders.length + "\n";
    summary += "- Total Revenue: ₹" + totalRevenue.toFixed(2) + "\n\n";
  }

  // Reservations summary
  const reservationsSheet = ss.getSheetByName("Reservations");
  if (reservationsSheet) {
    const reservationsData = reservationsSheet.getDataRange().getValues();
    const todayReservations = reservationsData.filter((row) => {
      if (row[0]) {
        // Timestamp column
        const rowDate = Utilities.formatDate(
          new Date(row[0]),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd",
        );
        return rowDate === today;
      }
      return false;
    });

    summary += "RESERVATIONS:\n";
    summary += "- New Reservations Today: " + todayReservations.length + "\n\n";
  }

  // Feedback summary
  const feedbackSheet = ss.getSheetByName("Feedback");
  if (feedbackSheet) {
    const feedbackData = feedbackSheet.getDataRange().getValues();
    const todayFeedback = feedbackData.filter((row) => {
      if (row[0]) {
        // Timestamp column
        const rowDate = Utilities.formatDate(
          new Date(row[0]),
          Session.getScriptTimeZone(),
          "yyyy-MM-dd",
        );
        return rowDate === today;
      }
      return false;
    });

    summary += "FEEDBACK:\n";
    summary += "- New Feedback Today: " + todayFeedback.length + "\n\n";
  }

  summary += "Full data is attached as Excel file.\n\n";
  summary += "Best regards,\nRestaurant Management System";

  return summary;
}

// ============================================
// 6. FORM VALIDATION (PASSWORD PROTECTION)
// ============================================

function validateFormSubmission(e) {
  // This function can be used as a form submit trigger
  // to validate password or other security measures

  const formResponse = e.response;
  const itemResponses = formResponse.getItemResponses();

  // Check for password field (if added to forms)
  const passwordResponse = itemResponses.find((item) =>
    item.getItem().getTitle().toLowerCase().includes("password"),
  );

  if (passwordResponse) {
    const password = passwordResponse.getResponse();
    const correctPassword = "restaurant123"; // Change this to your desired password

    if (password !== correctPassword) {
      // Delete the invalid response
      formResponse.withItemResponse(
        passwordResponse.getItem().createResponse("INVALID"),
      );

      // Send notification email
      MailApp.sendEmail({
        to: "nilimeshpal4@gmail.com",
        subject: "Invalid Form Submission Attempt",
        body: "Someone attempted to submit a form with an incorrect password.",
      });

      return false;
    }
  }

  return true;
}

// ============================================
// 7. BACKUP DATA FUNCTION
// ============================================

function backupData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const backupFolder = DriveApp.getFoldersByName(
    "Restaurant Data Backups",
  ).hasNext()
    ? DriveApp.getFoldersByName("Restaurant Data Backups").next()
    : DriveApp.createFolder("Restaurant Data Backups");

  const timestamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd_HH-mm-ss",
  );
  const backupName = "Restaurant_Data_Backup_" + timestamp;

  const backup = ss.copy(backupName);
  DriveApp.getFileById(backup.getId()).moveTo(backupFolder);

  SpreadsheetApp.getUi().alert("Backup created successfully: " + backupName);
}

// ============================================
// 8. SCHEDULED FUNCTIONS (SET UP TRIGGERS)
// ============================================

function setupTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => ScriptApp.deleteTrigger(trigger));

  // Create daily email trigger (runs at 9 AM every day)
  ScriptApp.newTrigger("emailDailyReport")
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();

  // Create weekly backup trigger (runs every Sunday at 10 PM)
  ScriptApp.newTrigger("backupData")
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(22)
    .create();

  SpreadsheetApp.getUi().alert("Triggers set up successfully!");
}

// ============================================
// 9. WEB APP FUNCTIONS (FOR API ACCESS)
// ============================================

function doGet(e) {
  const action = e.parameter.action;

  switch (action) {
    case "export":
      return exportToExcelWeb();
    case "summary":
      return getSummaryData();
    default:
      return ContentService.createTextOutput("Restaurant Data API");
  }
}

function doPost(e) {
  const action = e.parameter.action;

  switch (action) {
    case "email-report":
      emailDailyReport();
      return ContentService.createTextOutput("Report sent successfully");
    default:
      return ContentService.createTextOutput("Invalid action");
  }
}

function exportToExcelWeb() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const url =
    "https://docs.google.com/spreadsheets/d/" +
    ss.getId() +
    "/export?format=xlsx";

  return ContentService.createTextOutput(
    JSON.stringify({ url: url }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function getSummaryData() {
  const summary = generateDailySummary();
  return ContentService.createTextOutput(
    JSON.stringify({ summary: summary }),
  ).setMimeType(ContentService.MimeType.JSON);
}
