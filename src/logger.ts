import log4js from 'log4js';

const log = log4js.configure({
  appenders: {
    out: { type: 'console' },
    err: { type: 'stderr' },
  },
  categories: {
    default: { appenders: ['out'], level: 'INFO' },
    err: { appenders: ['err'], level: 'ERROR' },
  },
});

export const logger = {
  info: (message: unknown) => log.getLogger().info(message),
  error: (message: unknown) => log.getLogger().error(message),
  // warn: log.getLogger().warn,
};
