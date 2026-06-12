import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle0", timeout: 60000 });

const result = await page.evaluate(() => {
  const found = { fontDisplay: [], fontMonoMk: [], bgMkBg: [], themeVars: [] };
  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    const walk = (ruleList) => {
      for (const rule of ruleList) {
        if (rule.cssRules) walk(rule.cssRules);
        const text = rule.cssText || "";
        if (text.includes(".font-display")) found.fontDisplay.push(text.slice(0, 200));
        if (text.includes(".font-mono-mk")) found.fontMonoMk.push(text.slice(0, 200));
        if (text.includes(".bg-mk-bg")) found.bgMkBg.push(text.slice(0, 120));
      }
    };
    walk(rules);
  }
  const rootStyle = getComputedStyle(document.documentElement);
  found.themeVars = [
    "--font-display: " + rootStyle.getPropertyValue("--font-display"),
    "--font-mono-mk: " + rootStyle.getPropertyValue("--font-mono-mk"),
  ];
  const wrapper = document.querySelector("[data-marketing]");
  found.wrapperClass = wrapper ? wrapper.className.slice(0, 200) : "NO WRAPPER";
  const wStyle = wrapper ? getComputedStyle(wrapper) : null;
  found.wrapperVars = wStyle
    ? [
        "--font-space-grotesk: " + wStyle.getPropertyValue("--font-space-grotesk"),
        "--font-plex-mono: " + wStyle.getPropertyValue("--font-plex-mono"),
      ]
    : [];
  return found;
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
