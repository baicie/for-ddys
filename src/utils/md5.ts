import crypto from 'node:crypto';

export function md5(s: unknown) {
  return crypto.createHash('md5').update(`${s}`).digest('hex');
}
