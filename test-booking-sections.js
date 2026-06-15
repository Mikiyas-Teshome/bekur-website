const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    
    await page.goto("http://localhost:3000/book", { waitUntil: "networkidle2", timeout: 10000 });
    
    // Scroll to the date/time section
    await page.evaluate(() => { window.scrollBy(0, 500); });
    await new Promise(r => setTimeout(r, 500));
    
    // Take screenshot of the scheduling section
    await page.screenshot({ path: "booking-schedule-section.png", fullPage: false });
    console.log("? Schedule section screenshot saved");
    
    // Test dropdown click
    const dropdownButtons = await page.$$("button[class*='px-4'][class*='border'][class*='rounded']");
    console.log(`Found ${dropdownButtons.length} buttons`);
    
    if (dropdownButtons.length > 0) {
      // Click timezone dropdown
      await dropdownButtons[0].click();
      await new Promise(r => setTimeout(r, 300));
      
      // Take screenshot of open dropdown
      await page.screenshot({ path: "booking-dropdown-open.png", fullPage: false });
      console.log("? Dropdown open screenshot saved");
    }
    
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
