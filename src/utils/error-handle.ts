import type { Response } from 'express';
import { CODE_ERROR, MESSAGE_SUCCESS } from './constant';

// export function defaultErrorHandler(
//   error: unknown,
//   i18nStr: string = "error.Unexpected"
// ) {
//   return (next: NextFunction, res: Response) => {
//     return next(boom.badRequest("error", `${res.__(i18nStr)}:${error}`));
//   };
// }

export function defaultErrorHandler(res: Response, error: unknown) {
  if (error instanceof Error) {
    res.json({
      code: CODE_ERROR,
      msg: MESSAGE_SUCCESS,
      data: error.message,
    });
  }
}
