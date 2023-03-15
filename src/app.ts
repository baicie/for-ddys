import express from 'express';
import 'reflect-metadata';
import connection from './utils/db/db';
import routers from './routes';
import bodyParser from 'body-parser';
import i18n from 'i18n';
import cors from 'cors';

i18n.configure({
  locales: ['en', 'zh-cn'], // 声明包含语言
  directory: __dirname + '/languages', // 设置语言文件目录
  queryParameter: 'lang', // 设置查询参数
  defaultLocale: 'zh-cn', // 设置默认语言
  objectNotation: true,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(i18n.init);

app.get('/', (req, res) => {
  res.send(res.__('hello'));
});

app.use('/api', routers);

connection
  .initialize()
  .then(() => {
    console.log(`typeorm has started `);
  })
  .catch((error) => {
    console.error(`typeorm error:${error}`);
  });

app.listen(6174, () => {
  console.log('Server is running at 6174');
});
