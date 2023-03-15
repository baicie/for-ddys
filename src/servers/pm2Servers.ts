import boom from '@hapi/boom';
import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { defaultErrorHandler } from '../utils/error-handle';
// import shell from 'shelljs';
// import pm2 from 'pm2';

export async function pm2Server(req: Request, res: Response) {
  try {
    // if (!shell.which('pm2')) {
    //   shell.echo('Sorry, this script requires pm2');
    //   shell.exec('npm install -g pm2');
    //   shell.exit(1);
    // } else {
    //   shell.echo('yes, this script requires pm2');
    // }
    // res.send(shell.exec('pm2 list'));
  } catch (error) {
    defaultErrorHandler(res, error);
  }
}

export async function pm2List(req: Request, res: Response) {
  try {
    // res.send(shell.exec("pm2 list"));
    // pm2.list((error, list) => {
    //   defaultSucesshandler(res, list);
    //   process.send({
    //     type : 'process:msg',
    //     data : {
    //       success : true
    //     }
    //   })
    // });
    // pm2.
  } catch (error) {
    defaultErrorHandler(res, error);
  }
}

export async function pm2Stop(req: Request, res: Response, next: NextFunction) {
  try {
    const err = validationResult(req);
    if (!err.isEmpty) {
      next(boom.badRequest('error', err.array()));
    } else {
      const { id } = req.body;
      if (typeof id === 'undefined') return;
      // pm2.stop(id, (error) => {
      //   if (error) {
      //     defaultErrorHandler(res, error);
      //   } else {
      //     defaultSucesshandler(res, 'success');
      //   }
      // });
    }
  } catch (error) {
    defaultErrorHandler(res, error);
  }
}

export async function pm2Reload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const err = validationResult(req);
    if (!err.isEmpty) {
      next(boom.badRequest('error', err.array()));
    } else {
      // const { id } = req.body;
      console.log('pm2Reload', req.body);

      // if (typeof id === 'undefined') return;
      // pm2.reload(id, (error) => {
      //   if (error) {
      //     defaultErrorHandler(res, error);
      //   } else {
      //     defaultSucesshandler(res, 'success');
      //   }
      // });
    }
  } catch (error) {
    defaultErrorHandler(res, error);
  }
}
