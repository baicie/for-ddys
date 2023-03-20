/* eslint-disable no-console */
import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { DataSource } from 'typeorm';
import color from 'picocolors';
import cheerio from 'cheerio';
import connection from './utils/db/db';

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
    page = await browser.newPage();
    console.log(color.green('init success'));
  } catch (error) {
    if (browser) browser.close();

    console.log(color.yellow(`error${error}`));
  }
}

async function getPage(num: number) {
  try {
    if (!(browser && database && page)) return;
    for (let i = 1; i < num + 1; i++) {
      //
      const url = `${basePath}/category/movie/page/${i}`;
      await page.goto(url);
      const $ = cheerio.load(await page.content());
      const list = $('.post-box-list').find('article');
      for (const item of list)
        console.log(color.blue(item.attribs['data-href']));
    }
  } catch (error) {
    console.log(color.yellow(`error${error}`));
  }
}

main().then(() => {
  getPage(1);
});
