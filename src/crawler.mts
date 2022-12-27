import { chromium, expect } from "@playwright/test"
type CrawLingOption = {maxRetry?:number,timeout:number}

export const crawlHelloWorkWebPage = async (options :CrawLingOption = {timeout:5000}) => {
  const {maxRetry,timeout} = options;
  const page = await instantiatePage();
  page.setDefaultTimeout(timeout);

  const url = "https://www.hellowork.mhlw.go.jp/index.html";
  await page.goto(url)
  await page.locator("a").locator("text=求人情報検索").first().click()
  await expect(page.locator("#ID_searchBtn")).toHaveCount(1)
  await page.locator("#ID_searchBtn").click()
  await page.locator("#ID_searchBtn").click()
  for (let pageNum = 0; pageNum < 10; pageNum++) {
    const detailButtons = page.locator("text=詳細を表示")
    const buttonsLength = await detailButtons.count()
    for (let i = 0; i < buttonsLength; i++) {
      await detailButtons.nth(i).click()
    }
    await page.locator("[name=fwListNaviBtnNext]").first().click()
  }

  const urls = page
  .context()
  .pages()
  .map((page) => page.url())
  .filter((url) => url !== `https://www.hellowork.mhlw.go.jp/index.html`)

  await page.close()

  return urls;
}

const instantiatePage = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  return page;
}