import { Request, Response, Router } from 'express';
import { jwtAuth } from '../utils/user-jwt';
import demoRouter from './demo';
import pm2Router from './pm2';
import userRouter from './user';

type errorType = {
  name: string;
  status: number;
  message: string;
  output: {
    statusCode: number;
    payload: {
      error: unknown;
    };
  };
  data: unknown;
};

const router: Router = Router();

router.use(jwtAuth);

router.use('/demo', demoRouter);

router.use('/user', userRouter);

router.use('/pm2', pm2Router);

router.use((err: errorType, req: Request, res: Response) => {
  // 自定义用户认证失败的错误返回
  // console.log("err===", JSON.stringify(err));
  if (err && err.name === 'UnauthorizedError') {
    const { status = 401 } = err;
    // 抛出401异常
    res.status(200).json({
      code: status,
      msg: 'token失效，请重新登录',
      data: null,
    });
  } else {
    const { output } = err || {};
    const errCode = (output && output.statusCode) || 500;
    const errMsg = err.message;
    const errData = err.data;
    res.status(200).json({
      code: errCode,
      msg: errMsg,
      data: errData,
    });
  }
});

export default router;
