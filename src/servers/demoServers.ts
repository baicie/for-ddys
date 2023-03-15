import type { Request, Response, NextFunction } from 'express';
import { CODE_ERROR } from '../utils/constant';
import boom from '@hapi/boom';
import { validationResult } from 'express-validator';
import { Base } from '../entity/Base';
import connection from '../utils/db/db';

const demoRepository = connection.getRepository(Base);

export async function demo(req: Request, res: Response, next: NextFunction) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    next(boom.badRequest('error', err.array()));
  } else {
    const result = await demoRepository.findOneBy({
      id: '1',
    });

    res.json({
      code: CODE_ERROR,
      msg: '用户名或旧密码错误',
      data: result,
    });
  }
}
