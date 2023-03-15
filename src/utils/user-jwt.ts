import type { Request } from 'express';
import { expressjwt } from 'express-jwt'; // 引入express-jwt模块
import jwt from 'jsonwebtoken'; // 引入验证jsonwebtoken模块
import type { UserRoleType } from '../entity';
import { PRIVATE_KEY } from './constant'; // 引入自定义的jwt密钥

// 验证token是否过期

export const jwtAuth: unknown = expressjwt({
  // 设置密钥
  secret: PRIVATE_KEY,
  // 设置为true表示校验，false表示不校验
  credentialsRequired: true,
  algorithms: ['ES256'],
  // 自定义获取token的函数
  // getToken: (req) => {
  //   if (
  //     req.headers.authorization &&
  //     req.headers.authorization.split(' ')[0] === 'Bearer'
  //   ) {
  //     return req.headers.authorization.split(' ')[1];
  //   } else if (req.headers && req.headers['token']) {
  //     return req.headers['token'];
  //   }
  //   return undefined;
  // },
  // 设置jwt认证白名单，比如/api/login登录接口不需要拦截
}).unless({
  path: [
    '/',
    '/api/demo/index',
    '/api/user/has_admin',
    '/api/user/create_admin',
    '/api/user/login',
    '/api/user/logout',
    '/api/pm2/list',
    '/api/pm2/stop',
    '/api/pm2/reload',
  ],
});

// jwt-token解析
export function decode(req: Request) {
  const token = req.get('Authorization');

  if (!token) return;

  return jwt.verify(token, PRIVATE_KEY);
}

export function jwtSign(userId: string, role: UserRoleType) {
  return jwt.sign(
    {
      userid: userId,
      role: role,
    },
    PRIVATE_KEY,
    {
      expiresIn: '1d',
    },
  );
}

module.exports = {
  jwtAuth,
  decode,
};
