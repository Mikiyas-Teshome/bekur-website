const puppeteer = require("puppeteer");

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    
    await page.goto("http://localhost:3000/book", { waitUntil: "networkidle2", timeout: 10000 });
    
    // Scroll to see timezone
    await page.evaluate(() => { window.scrollBy(0, 500); });
    await new Promise(r => setTimeout(r, 300));
    
    // Get timezone dropdown button
    const dropdownButtons = await page.$$("button[class*='px-4'][class*='border']");
    const tzDropdown = dropdownButtons[0];
    
    // Click to open
    await tzDropdown.click();
    await new Promise(r => setTimeout(r, 300));
    const isOpenBefore = await page.evaluate(() => {
      const searchInput = document.querySelector('input[placeholder*="Search"]');
      return searchInput !== null;
    });
    console.log("Dropdown open: " + (isOpenBefore ? "? YES" : "? NO"));
    
    // Type in search
    const searchInput = await page.$('input[placeholder*="Search"]');
    if (searchInput) {
      await searchInput.type("London");
      await new Promise(r => setTimeout(r, 300));
      
      const hasFiltered = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('[role="menuitem"]'));
        return items.some(item => item.textContent.includes("London"));
      });
      console.log("Search filtering works: " + (hasFiltered ? "? YES" : "? NO"));
    }
    
    // Click outside to close (on the calendar area)
    await page.click(".rdp-month", { offset: { x: 50, y: 50 } }).catch(() => {
      // Try alternative click location
      page.evaluate(() => {
        document.querySelector("body").click();
      });
    });
    await new Promise(r => setTimeout(r, 300));
    
    const isOpenAfter = await page.evaluate(() => {
      const searchInput = document.querySelector('input[placeholder*="Search"]');
      return searchInput !== null;
    });
    console.log("Dropdown closes on click outside: " + (isOpenAfter ? "? NO" : "? YES"));
    
    // Take final screenshot
    await page.screenshot({ path: "booking-dropdown-closed.png", fullPage: false });
    console.log("? All interaction tests completed");
    
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
