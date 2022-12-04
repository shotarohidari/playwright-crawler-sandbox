import { chromium, expect } from "@playwright/test"
import { writeFile } from "fs/promises"
const timeoutSecs = 60
;(async () => {
  console.log(`start crawling. url: https://www.hellowork.mhlw.go.jp/index.html`)
  const browser = await chromium.launch()
  const page = await browser.newPage()
  page.setDefaultTimeout(timeoutSecs * 1000)
  await page.goto(`https://www.hellowork.mhlw.go.jp/index.html`)
  await page.locator("a").locator("text=求人情報検索").first().click()
  await expect(page.locator("#ID_searchBtn")).toHaveCount(1)
  await page.locator("#ID_searchBtn").click()
  for (let pageNum = 0; pageNum < 10; pageNum++) {
    const detailsButtons = page.locator("text=詳細を表示")
    const buttonCount = await detailsButtons.count()
    for (let i = 0; i < buttonCount; i++) {
      await detailsButtons.nth(i).click()
    }
    await page.locator("[name=fwListNaviBtnNext]").first().click()
  }
  const urls = page
    .context()
    .pages()
    .map((page) => page.url())
    .filter((url) => url !== `https://www.hellowork.mhlw.go.jp/index.html`)
  await browser.close()
  await writeFile("urls.csv", urls.join("\n"))
})()
