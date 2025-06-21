// Google Apps Script Code for Restaurant Data Tracker
// Copy this code to your Google Apps Script project

// ============================================
// 1. AUTO-CALCULATE TOTAL PRICE IN ORDERS TAB
// ============================================

function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const sheetName = sheet.getName();
  const row = range.getRow();
  const col = range.getColumn();

  // Skip header row
  if (row === 1) return;

  // ORDERS SHEET AUTOMATION
  if (sheetName === "Orders") {
    // Auto-calculate total price when Quantity (D) or Price per Item (E) is edited
    if (col === 4 || col === 5) {
      const quantity = sheet.getRange(row, 4).getValue();
      const pricePerItem = sheet.getRange(row, 5).getValue();

      if (
        quantity &&
        pricePerItem &&
        !isNaN(quantity) &&
        !isNaN(pricePerItem)
      ) {
        const totalPrice = quantity * pricePerItem;
        sheet.getRange(row, 6).setValue(totalPrice);

        // Format currency columns
        sheet.getRange(row, 5).setNumberFormat("₹#,##0.00");
        sheet.getRange(row, 6).setNumberFormat("₹#,##0.00");
      }
    }

    // Auto-fill timestamp when Customer Name is entered
    if (col === 2 && range.getValue()) {
      const now = new Date();
      sheet
        .getRange(row, 8)
        .setValue(
          Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd"),
        );
      sheet
        .getRange(row, 9)
        .setValue(
          Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm:ss"),
        );
    }
  }

  // MESSAGES SHEET AUTOMATION
  if (sheetName === "Messages") {
    // Auto-fill response status and priority
    if (col === 2 && range.getValue()) {
      // When Name is entered
      const now = new Date();
      sheet.getRange(row, 6).setValue("New"); // Status column
      sheet.getRange(row, 7).setValue("Medium"); // Priority column
      sheet
        .getRange(row, 8)
        .setValue(
          Utilities.formatDate(
            now,
            Session.getScriptTimeZone(),
            "yyyy-MM-dd HH:mm:ss",
          ),
        ); // Received Date
    }
  }

  // RESERVATIONS SHEET AUTOMATION
  if (sheetName === "Reservations") {
    // Auto-fill confirmation status
    if (col === 2 && range.getValue()) {
      // When Name is entered
      sheet.getRange(row, 7).setValue("Pending"); // Status column
      const now = new Date();
      sheet
        .getRange(row, 8)
        .setValue(
          Utilities.formatDate(
            now,
            Session.getScriptTimeZone(),
            "yyyy-MM-dd HH:mm:ss",
          ),
        ); // Booking Date
    }
  }

  // BILLING SHEET AUTOMATION
  if (sheetName === "Billing") {
    // Auto-calculate final amount when tax or discount changes
    if (col === 3 || col === 4) {
      // Tax Amount or Discount columns
      const baseAmount = sheet.getRange(row, 2).getValue() || 0;
      const taxAmount = sheet.getRange(row, 3).getValue() || 0;
      const discount = sheet.getRange(row, 4).getValue() || 0;

      const finalAmount = baseAmount + taxAmount - discount;
      sheet.getRange(row, 5).setValue(finalAmount);

      // Format currency
      sheet.getRange(row, 2, 1, 4).setNumberFormat("₹#,##0.00");
    }
  }

  // FEEDBACK SHEET AUTOMATION
  if (sheetName === "Feedback") {
    // Auto-categorize feedback based on rating
    if (col === 4 && range.getValue()) {
      // Rating column
      const rating = range.getValue();
      let category = "Average";

      if (rating >= 4) category = "Excellent";
      else if (rating >= 3) category = "Good";
      else if (rating >= 2) category = "Fair";
      else category = "Poor";

      sheet.getRange(row, 6).setValue(category); // Category column
      sheet.getRange(row, 7).setValue("New"); // Status column
    }
  }
}

// ============================================
// 2. FORMAT CURRENCY COLUMNS ON SHEET OPEN
// ============================================

function onOpen() {
  formatCurrencyColumns();
  createCustomMenu();
  setupAutoRefresh();
}

function formatCurrencyColumns() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Format Orders sheet
  const ordersSheet = ss.getSheetByName("Orders");
  if (ordersSheet) {
    ordersSheet.getRange("E:E").setNumberFormat("₹#,##0.00"); // Price per Item
    ordersSheet.getRange("F:F").setNumberFormat("₹#,##0.00"); // Total Price
  }

  // Format Billing sheet
  const billingSheet = ss.getSheetByName("Billing");
  if (billingSheet) {
    billingSheet.getRange("B:E").setNumberFormat("₹#,##0.00"); // All currency columns
  }

  // Setup conditional formatting for status columns
  setupConditionalFormatting();
}

function setupConditionalFormatting() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Messages sheet status formatting
  const messagesSheet = ss.getSheetByName("Messages");
  if (messagesSheet) {
    const statusRange = messagesSheet.getRange("F:F");

    // Clear existing rules
    statusRange.clearFormat();

    // New status - Red background
    const newRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("New")
      .setBackground("#ffebee")
      .setFontColor("#c62828")
      .setRanges([statusRange])
      .build();

    // Responded status - Green background
    const respondedRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Responded")
      .setBackground("#e8f5e8")
      .setFontColor("#2e7d32")
      .setRanges([statusRange])
      .build();

    messagesSheet.setConditionalFormatRules([newRule, respondedRule]);
  }

  // Reservations sheet status formatting
  const reservationsSheet = ss.getSheetByName("Reservations");
  if (reservationsSheet) {
    const statusRange = reservationsSheet.getRange("G:G");
    statusRange.clearFormat();

    const pendingRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Pending")
      .setBackground("#fff3e0")
      .setFontColor("#ef6c00")
      .setRanges([statusRange])
      .build();

    const confirmedRule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo("Confirmed")
      .setBackground("#e8f5e8")
      .setFontColor("#2e7d32")
      .setRanges([statusRange])
      .build();

    reservationsSheet.setConditionalFormatRules([pendingRule, confirmedRule]);
  }
}

// ============================================
// 3. CREATE CUSTOM MENU
// ============================================

function createCustomMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🍽️ Restaurant Manager")
    .addItem("📊 Export to Excel", "exportToExcel")
    .addItem("📧 Email Daily Report", "emailDailyReport")
    .addItem("💰 Format All Currency", "formatCurrencyColumns")
    .addItem("🔄 Refresh Data", "refreshAllData")
    .addItem("📋 Generate Summary", "generateQuickSummary")
    .addItem("💾 Backup Data", "backupData")
    .addItem("⚙️ Setup Auto-Triggers", "setupTriggers")
    .addToUi();
}

function setupAutoRefresh() {
  // Auto-refresh data every 5 minutes during business hours
  const now = new Date();
  const hour = now.getHours();

  // Only during business hours (9 AM to 11 PM)
  if (hour >= 9 && hour <= 23) {
    refreshAllData();
  }
}

function refreshAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Refresh all sheets
  const sheets = ss.getSheets();
  sheets.forEach((sheet) => {
    if (sheet.getName() !== "Dashboard") {
      sheet.getDataRange().getValues(); // Force refresh
    }
  });

  // Update formatting
  formatCurrencyColumns();

  console.log("Data refreshed at: " + new Date());
}

function generateQuickSummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  try {
    const summary = generateDailySummary();
    ui.alert("📊 Daily Summary", summary, ui.ButtonSet.OK);
  } catch (error) {
    ui.alert(
      "Error",
      "Failed to generate summary: " + error.toString(),
      ui.ButtonSet.OK,
    );
  }
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

  // Create auto-refresh trigger (every 5 minutes during business hours)
  ScriptApp.newTrigger("refreshAllData").timeBased().everyMinutes(5).create();

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

  // Create form submission trigger for faster processing
  ScriptApp.newTrigger("onFormSubmit").onFormSubmit().create();

  SpreadsheetApp.getUi().alert(
    "✅ All triggers set up successfully!\n\n" +
      "• Auto-refresh: Every 5 minutes\n" +
      "• Daily reports: 9 AM\n" +
      "• Weekly backup: Sunday 10 PM\n" +
      "• Form processing: Instant",
  );
}

// NEW: Fast form submission handler
function onFormSubmit(e) {
  const sheet = e.range.getSheet();
  const row = e.range.getRow();
  const sheetName = sheet.getName();

  // Process form submissions instantly
  if (sheetName === "Orders") {
    processOrderSubmission(sheet, row);
  } else if (sheetName === "Messages") {
    processMessageSubmission(sheet, row);
  } else if (sheetName === "Reservations") {
    processReservationSubmission(sheet, row);
  }

  // Send instant notification
  sendInstantNotification(sheetName, row);
}

function processOrderSubmission(sheet, row) {
  const quantity = sheet.getRange(row, 4).getValue();
  const pricePerItem = sheet.getRange(row, 5).getValue();

  if (quantity && pricePerItem) {
    const totalPrice = quantity * pricePerItem;
    sheet.getRange(row, 6).setValue(totalPrice);
    sheet.getRange(row, 5, 1, 2).setNumberFormat("₹#,##0.00");
  }

  const now = new Date();
  sheet
    .getRange(row, 8)
    .setValue(
      Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd"),
    );
  sheet
    .getRange(row, 9)
    .setValue(
      Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm:ss"),
    );
}

function processMessageSubmission(sheet, row) {
  const now = new Date();
  sheet.getRange(row, 6).setValue("New");
  sheet.getRange(row, 7).setValue("Medium");
  sheet
    .getRange(row, 8)
    .setValue(
      Utilities.formatDate(
        now,
        Session.getScriptTimeZone(),
        "yyyy-MM-dd HH:mm:ss",
      ),
    );
}

function processReservationSubmission(sheet, row) {
  sheet.getRange(row, 7).setValue("Pending");
  const now = new Date();
  sheet
    .getRange(row, 8)
    .setValue(
      Utilities.formatDate(
        now,
        Session.getScriptTimeZone(),
        "yyyy-MM-dd HH:mm:ss",
      ),
    );
}

function sendInstantNotification(sheetName, row) {
  try {
    const adminEmail = "nilimeshpal4@gmail.com";
    const subject = `🔔 New ${sheetName} Submission - Row ${row}`;
    const body = `A new ${sheetName.toLowerCase()} has been submitted at ${new Date().toLocaleString()}.\n\nPlease check your Restaurant Data Tracker for details.`;

    MailApp.sendEmail({
      to: adminEmail,
      subject: subject,
      body: body,
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
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
