import type { Response } from 'express';
import { CODE_SUCCESS, MESSAGE_SUCCESS } from './constant';

export function defaultSucesshandler(res: Response, data: unknown = null) {
  res.json({
    code: CODE_SUCCESS,
    msg: MESSAGE_SUCCESS,
    data: data,
  });
}
