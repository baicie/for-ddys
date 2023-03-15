import type { Meta } from 'express-validator';

export function defaultI18nWarpper(i18nStr: string) {
  return (value: any, { req, location, path }: Meta) => {
    return req['__'](i18nStr, { value, location, path });
  };
}
