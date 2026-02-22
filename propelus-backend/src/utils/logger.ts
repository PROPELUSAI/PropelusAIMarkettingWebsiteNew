type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function formatTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, message: string, meta?: unknown): string {
  const timestamp = formatTimestamp();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  if (meta !== undefined) {
    return `${prefix} ${message} ${typeof meta === 'object' ? JSON.stringify(meta) : meta}`;
  }
  return `${prefix} ${message}`;
}

export const logger = {
  info(message: string, meta?: unknown): void {
    console.log(formatMessage('info', message, meta));
  },

  warn(message: string, meta?: unknown): void {
    console.warn(formatMessage('warn', message, meta));
  },

  error(message: string, meta?: unknown): void {
    console.error(formatMessage('error', message, meta));
  },

  debug(message: string, meta?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};
