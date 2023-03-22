/* eslint-disable no-console */
import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { DataSource } from 'typeorm';
import color from 'picocolors';
import cheerio from 'cheerio';
import axios from 'axios';
import { v4 } from 'uuid';
import connection from './utils/db/db';
import type { Movice, Play, PlayType } from './entity';
import { getMoviceById, getPlaysFormDB, setMovice, setPlay } from './service';

puppeteer.use(AdblockerPlugin()).use(StealthPlugin());

let browser: undefined | Browser;
let page: undefined | Page;

let database: undefined | DataSource;

const basePath = 'https://ddys.one';
const type = ['zheng_pian', 'chao_qing', 'hd'];

async function initBrowser() {
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    database = await connection.initialize();
    page = await browser.newPage();
    console.log(color.green('浏览器初始化成功'));
  } catch (error) {
    if (browser) browser.close();

    console.log(color.yellow(`init error${error}`));
  }
}

async function getPages(num: number) {
  try {
    if (!(browser && database && page)) return;
    for (let i = 1; i < num + 1; i++) {
      //
      const url = `${basePath}/category/movie/page/${i}`;
      await page.goto(url);
      const $ = cheerio.load(await page.content());
      const list = $('.post-box-list');
      const articles = list.find('article');
      const titles = list.find('.post-box-title');
      const locals = list.find('.post-box-meta');

      for (let i = 0; i < articles.length; i++) {
        const article = articles[i]?.attribs['data-href']?.slice(5, 13);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const title = titles[i]?.children[0].children[0].data;
        console.log(title);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const local = locals[i]?.children[0].data;
        if (!article) continue;
        const params: Movice = {
          id: article,
          img: article,
          title,
          local,
        };
        await setMovice(params);

        const moivce = await getMoviceById(params.id);
        if (!moivce) continue;
        for (let j = 0; j < type.length; j++) {
          const playList = await getPlays(article, type[j] as PlayType);
          for (let x = 0; x < playList.length; x++) {
            const play: Play = {
              id: v4(),
              type: type[j] as PlayType,
              play: playList[x].play_data,
              site: playList[x].src_site,
              movice: moivce,
            };
            console.log('plays', play);

            await setPlay(play);
          }
        }

        console.log('m', await getPlaysFormDB());
      }
    }
  } catch (error) {
    console.log(color.yellow(`error${error}`));
  }
}

async function getPlays(id: string, type: PlayType) {
  const res = await axios.get(`${basePath}/ddrk_plays/${id}/${type}`);
  return res.data.video_plays;
}

async function main() {
  try {
    await initBrowser();
    await getPages(1);
    // await axiosDemo()
  } catch (error) {
    console.log(color.red(`error:${error}`));
  }
}

main()
  .then(() => {
    console.log(color.blue('获取完毕'));
  })
  .catch((e) => {
    console.log(color.red(`error:${e}`));
    process.exit(1);
  });
