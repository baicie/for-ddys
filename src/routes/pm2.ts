import { Router } from 'express';
import { body } from 'express-validator';
import { pm2List, pm2Reload, pm2Stop } from '../servers/pm2Servers';

const router: Router = Router();

// const vaildator = [
//   body('username').isString().withMessage('用户名类型错误'),
//   body('password').isString().withMessage('密码类型错误'),
// ];

router.get('/list', pm2List);

const vaildatorId = [body('id').notEmpty().withMessage('用户名类型错误')];

router.post('/stop', vaildatorId, pm2Stop);

router.post('/reload', vaildatorId, pm2Reload);

export default router;
