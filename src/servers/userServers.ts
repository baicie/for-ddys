import boom from '@hapi/boom';
import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../entity';
import { CODE_SUCCESS, decode, MESSAGE_SUCCESS, PRIVATE_KEY } from '../utils';
import connection from '../utils/db/db';
import { defaultErrorHandler } from '../utils/error-handle';
import { defaultSucesshandler } from '../utils/sucess-handle';

const userRepository = connection.getRepository(User);

/**
 * 查询是否有管理员 没有显示创建管理员
 * @param req
 * @param res
 * @param next
 */
export async function hasAdmin(req: Request, res: Response) {
  const result = await userRepository.findOneBy({
    role: 'admin',
  });

  // const result = false;
  res.json({
    code: CODE_SUCCESS,
    msg: MESSAGE_SUCCESS,
    data: Boolean(result),
  });
}

/**
 * 创建新管理
 * @param req
 * @param res
 * @param next
 */
export async function createAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    next(boom.badRequest('error', err.array()));
  } else {
    const { username, password } = req.body as User;
    try {
      const admin = await userRepository.findOneBy({
        role: 'admin',
        username: username,
      });
      if (admin) {
        next(boom.badRequest('error', res.__('user.admin.adminExistence')));
      } else {
        const result = userRepository.create({
          role: 'admin',
          username,
          password,
        });
        await userRepository.save(result);

        defaultSucesshandler(res, res.__('user.admin.createSuccessMessage'));
      }
    } catch (error) {
      defaultErrorHandler(res, error);
    }
  }
}

export async function deleteAllAdminUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = decode(req) as string;
    const result = await userRepository.findOneBy({
      role: 'admin',
      userid: userId,
    });

    if (result) {
      await userRepository.clear();
      defaultSucesshandler(res, res.__('user.admin.deleteSuccessMessage'));
    } else {
      next(boom.badRequest('error', res.__('user.admin.adminExistence')));
    }
  } catch (error) {
    defaultErrorHandler(res, error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    next(boom.badRequest('error', err.array()));
  } else {
    const { username, password } = req.body as User;
    try {
      const user = await userRepository.findOneBy({
        username: username,
        password: password,
      });
      // console.log("user", user);

      if (user) {
        const token = jwt.sign(
          {
            userid: user.userid,
            role: user.role,
          },
          PRIVATE_KEY,
          {
            expiresIn: '1d',
          },
        );

        const result = {
          ...user,
          password: '',
          token: token,
        };

        res.json({
          code: CODE_SUCCESS,
          msg: MESSAGE_SUCCESS,
          data: result,
        });
      } else {
        next(boom.badRequest('error', res.__('user.admin.adminExistence')));
      }
    } catch (error) {
      console.log(error instanceof Error, (error as Error).message);

      defaultErrorHandler(res, error);
    }
  }
}
