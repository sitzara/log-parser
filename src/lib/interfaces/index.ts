export interface Reader {
  pipe(writer: Writer): void;
  transformer(transformer: Transformer): void;
}

export interface Transformer {
  transform(writer: Writer, line: string): void;
}

export interface Writer {
  write(data: string): void;
  end(): void;
}

export interface Parser {
  parse(line: string): ParsedLine;
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
