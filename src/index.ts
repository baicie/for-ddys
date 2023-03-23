import axios from 'axios';
import cheerio from 'cheerio';
import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { DataSource } from 'typeorm';
import { v4 } from 'uuid';
import dayjs from 'dayjs';
import type { Infor, Movice, Play, PlayType } from './entity';
import { logger } from './logger';
import { getMoviceById, setInfor, setMovice, setPlay } from './service';
import connection from './utils/db/db';

// 全局参数或者配置
puppeteer.use(AdblockerPlugin()).use(StealthPlugin());

let browser: undefined | Browser;
let page: undefined | Page;

let database: undefined | DataSource;

const basePath = 'https://ddys.one';
const type = ['zheng_pian', 'chao_qing', 'hd'];

// 初始化浏览器
async function initBrowser() {
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    database = await connection.initialize();
    page = await browser.newPage();
    // console.log(color.green('浏览器初始化成功'))
    logger.info('浏览器初始化成功');
  } catch (error) {
    if (browser) browser.close();

    logger.error(`init error${error}`);
  }
}

// 便利pages获取电影id与标题
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

      for (let j = 0; j < articles.length; j++) {
        const article = articles[j]?.attribs['data-href']?.slice(5, 13);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const title = titles[j]?.children[0].children[0].data;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const local = locals[j]?.children[0].data;
        if (!article) continue;
        const params: Movice = {
          id: article,
          img: article,
          title,
          local,
        };
        try {
          await setMovice(params);
          await getPlaysByMoviceId(params.id);
          await getMoviceInfo(params.id);
        } catch (error) {
          logger.error(`出餐失败${error}`);
        }
        logger.info(`${title} 现在已加入豪华套餐A`);
      }
    }
  } catch (error) {
    logger.error(`获取数据出错${error}`);
  }
}

// 根据电影id获取播放地址
async function getPlaysByMoviceId(moviceId: string) {
  const moivce = await getMoviceById(moviceId);
  if (!moivce) {
    logger.error(`${moviceId} 未找到`);
    return;
  }

  for (let j = 0; j < type.length; j++) {
    const playList = await getPlaysUrlRequest(moviceId, type[j] as PlayType);
    for (let x = 0; x < playList.length; x++) {
      const play: Play = {
        id: v4(),
        type: type[j] as PlayType,
        play: playList[x].play_data,
        site: playList[x].src_site,
        movice: moivce,
      };
      await setPlay(play);
      logger.info(`${play.site}: 现已加入全面豪华全家桶B`);
    }
  }
}

// axios请求
async function getPlaysUrlRequest(id: string, type: PlayType) {
  const res = await axios.get(`${basePath}/ddrk_plays/${id}/${type}`);
  return res.data.video_plays;
}

// 获取电影详情
async function getMoviceInfo(moviceId: string) {
  const start = dayjs();
  if (!page) {
    logger.error('盘子被掀翻了');
    return;
  }
  const moivceRow = await getMoviceById(moviceId);
  if (!moivceRow) {
    logger.error('盘子没找到');
    return;
  }
  await page.goto(`${basePath}/vod/${moviceId}`);

  // 解析html
  const $ = cheerio.load(await page.content());
  const conten = $('.doulist-item');
  const tagContent = $('.tags-links');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const title = conten.find('.cute')[0]?.children[0].data;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const tag = tagContent[0]?.children[1].children[0].data;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const sart = conten.find('.rating_nums')[0].children[0].data;

  const text =
    conten
      .find('.abstract')[0]
      ?.children.filter((item) => item.type === 'text')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      .map((item) => item.data)
      .join('\n') ?? '';

  const infor: Infor = {
    id: v4(),
    // same: conten.find('.crp_link'),
    movice: moivceRow,
    title,
    tag,
    sart,
    text,
  };

  await setInfor(infor);

  const diff = dayjs().diff(start, 'm');
  logger.info(`${moivceRow.title}耗时${diff}s`);

  await page.goBack();
}

// 主函数
async function main() {
  try {
    await initBrowser();
    await getPages(240);
  } catch (error) {
    logger.error(`main函数捕获${error}`);
  }
}

main()
  .then(() => {
    logger.info('获取完毕套餐已备餐');
  })
  .catch((error) => {
    logger.error(`饭桌被掀了${error}`);
    process.exit(1);
  });
