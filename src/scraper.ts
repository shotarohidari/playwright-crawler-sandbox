import { readFile, writeFile } from "fs/promises"
import { chromium } from "@playwright/test"
import {chunk} from "underscore";
;(async () => {
  console.log("start scraping");
  const urls = (await readFile("urls.csv", "utf-8")).split("\n").slice(1);
  const chunkedUrls = chunk(urls,20);
  let rows = new Array<string>();
  for(const urls of chunkedUrls) {
      const chunkedRows = await Promise.all(urls.map(async (url) => {
        const browser = await chromium.launch()
        const page = await browser.newPage();
        page.setDefaultTimeout(60 * 1000);
        await page.goto(url)
        const jobId = await page.locator("#ID_kjNo").textContent()
        const salary = await page.locator("#ID_chgn").textContent()
        const employmentInfo = (await page.locator("#ID_koyoKeitai").textContent());
        const selectionInfo = await page.locator("#ID_selectHoho").textContent()
        const applicationDocInfo = await page
          .locator("#ID_oboShoruitou")
          .textContent()
        await browser.close();
        return `"${jobId}","${salary}","${employmentInfo}","${selectionInfo}","${applicationDocInfo}"`
      }));
      rows = rows.concat(chunkedRows);
  }
  const header = "求人番号,給料,雇用形態,選考方法,必要な応募書類"
  const csvText = header + "\n" + rows.join("\n")
  await writeFile("results.csv", csvText)
})()
