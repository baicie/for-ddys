import debug from 'debug';

const filter = process.env.DEBUG_FILTER;
const DEBUG = process.env.DEBUG;

interface DebuggerOptions {
  onlyWhenFocused?: boolean | string;
}

export type DebugScope = `ddys:${string}`;

export function createDebugger(
  namespace: DebugScope,
  options: DebuggerOptions = {},
): debug.Debugger['log'] {
  const log = debug(namespace);
  const { onlyWhenFocused } = options;
  const focus =
    typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace;
  return (msg: string, ...args: any[]) => {
    if (filter && !msg.includes(filter)) return;

    if (onlyWhenFocused && !DEBUG?.includes(focus)) return;

    log(msg, ...args);
  };
}
