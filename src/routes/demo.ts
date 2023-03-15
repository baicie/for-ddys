import { body } from 'express-validator';
import { Router } from 'express';
import { demo } from '../servers/demoServers';

const router = Router();

const vaildator = [
  body('username').isString().withMessage('用户名类型错误'),
  body('password').isString().withMessage('密码类型错误'),
];

router.get('/index', vaildator, demo);

export default router;
