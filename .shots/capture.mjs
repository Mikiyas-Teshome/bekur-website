import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = "D:\\projects\\bekur\\bekur-website\\.shots";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 60000 });

// scroll through the page slowly so whileInView (once:true) fires everywhere
await page.evaluate(async () => {
  const step = 600;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 250));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 800));
});

await page.screenshot({ path: `${OUT}\\pp-full.png`, fullPage: true });

// admin check
const admin = await browser.newPage();
await admin.setViewport({ width: 1440, height: 1000 });
await admin.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle0", timeout: 60000 });
await admin.screenshot({ path: `${OUT}\\pp-admin.png` });

// console errors on home
const errors = [];
page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
await page.reload({ waitUntil: "networkidle0" });
console.log("console errors:", errors.length ? errors : "none");

await browser.close();
