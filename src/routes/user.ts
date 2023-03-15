import { Router } from 'express';
import { body } from 'express-validator';
import { hasAdmin, createAdmin, login } from '../servers';
import { defaultI18nWarpper } from '../utils/i18n-warpper';

const router = Router();

router.get('/has_admin', hasAdmin);

const createAdminValidation = [
  body('username')
    .notEmpty()
    .withMessage(defaultI18nWarpper('user.admin.emptyUserNameMessage'))
    .isString()
    .withMessage(defaultI18nWarpper('user.admin.notStringUserNameMessage')),
  body('password')
    .notEmpty()
    .withMessage(defaultI18nWarpper('user.admin.emptyPasswordMessage'))
    .isString()
    .withMessage(defaultI18nWarpper('user.admin.notStringPasswordMessage')),
];

router.post('/create_admin', createAdminValidation, createAdmin);

router.post('/login', createAdminValidation, login);

export default router;
