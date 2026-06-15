const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    console.log("\n?? BOOKING PAGE VERIFICATION\n");
    console.log("1. Loading page...");
    
    await page.goto("http://localhost:3000/book", { waitUntil: "networkidle2", timeout: 10000 });
    console.log("? Page loaded\n");
    
    // Get page title
    const title = await page.title();
    console.log(`2. Page title: ${title}`);
    
    // Check for key elements
    console.log("\n3. Checking UI elements:");
    const hasTimezoneLabel = await page.$("text=/Timezone/");
    const hasDateLabel = await page.$("text=/Select Date/");
    const hasTimeLabel = await page.$("text=/Select Time/");
    
    console.log(`   ? Timezone section: ${hasTimezoneLabel ? "found" : "missing"}`);
    console.log(`   ? Date picker section: ${hasDateLabel ? "found" : "missing"}`);
    console.log(`   ? Time slots section: ${hasTimeLabel ? "found" : "missing"}`);
    
    // Take screenshot
    console.log("\n4. Taking screenshot of booking form...");
    await page.screenshot({ path: "booking-page-screenshot.png", fullPage: false });
    console.log("? Screenshot saved to booking-page-screenshot.png");
    
    console.log("\n? VERIFICATION COMPLETE\n");
    
    await browser.close();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
