import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import connection from './utils/db/db';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { DataSource } from 'typeorm';

puppeteer.use(AdblockerPlugin()).use(StealthPlugin());

let browser: undefined | Browser;
let page: undefined | Page;

let database: undefined | DataSource;

const basePath = 'https://ddys.one';

async function main() {
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    database = await connection.initialize();
    console.log('init success');
  } catch (error) {
    if (browser) {
      browser.close();
    }
    console.log('error', error);
  }
}

async function OpenPage() {
  try {
    if (!(browser && database)) return;
    const url = `${basePath}/category/movie/`;
    page = await browser.newPage();

    await page.goto(url);
  } catch (error) {}
}

async function getPlays(id: string, type: string) {
  // https://ddys.one/ddrk_plays/20216172/chao_qing
}

main().then(() => {
  OpenPage();
});
