export interface Reader {
  pipe(transformer: Transformer): this;
}

export interface Transformer {
  pipe(writer: Writer): this;
  transform(data: string): void;
  end(): void;
}

export interface Writer {
  write(data: string): void;
  end(): void;
}

export interface Line<T> {
  format(): T;
  toString(): string;
}

export enum LogLevel {
  INFO = 'info',
  DEBUG = 'debug',
  WARN = 'warn',
  ERROR = 'error',
}

export interface ParsedLineData {
  [x: string]: string | number | undefined;
  transactionId?: string;
  err?: string;
}

export interface ParsedLine {
  date?: string;
  loglevel?: string;
  data?: ParsedLineData;
}

export interface FormattedLine {
  timestamp: number | null;
  loglevel: LogLevel;
  transactionId: string;
  err: string;
}
