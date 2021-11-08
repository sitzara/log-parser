export interface Reader {
  pipe(writer: Writer): void;
  transformer(transformer: Transformer): void;
}

export interface Parser {
  parse(line: string): ParseResult;
}

export enum LogLevel {
  INFO = 'info',
  DEBUG = 'debug',
  WARN = 'warn',
  ERROR = 'error',
}

export interface ParseResult {
  timestamp: number | null;
  loglevel: string | null;
  transactionId: string | null;
  err: LogLevel | null;
}

// export interface Filter {

// }

export interface Transformer {
  transform(writer: Writer, line: string): void;
}

export interface Writer {
  write(data: string): void;
  end(): void;
}
