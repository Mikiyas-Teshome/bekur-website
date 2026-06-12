import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 60000 });

const result = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const kicker = document.querySelector("main p.font-mono-mk, main [class*='font-mono-mk']");
  const h2 = document.querySelector("main h2");
  const get = (el) => (el ? getComputedStyle(el).fontFamily : "NOT FOUND");
  return {
    h1: get(h1),
    h2: get(h2),
    kicker: get(kicker),
    loadedFonts: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`),
  };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
