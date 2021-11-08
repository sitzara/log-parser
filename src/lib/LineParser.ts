import { LogLevel, ParseResult, Parser } from './interfaces';

export default class LineParser implements Parser {
  private regexp = /^([A-Za-z0-9-:\.]+)\s-\s(info|debug|error|warn)\s-\s(.+)?$/i;

  public parse(str: string): ParseResult  {
    const defaultResult = {
      timestamp: null,
      loglevel: null,
      transactionId: null,
      err: null,
    };

    const result = this.regexp.exec(str);
    if (!result) return defaultResult;

    const date = result[1];
    const loglevel = result[2];
    const data = result[3];
    const { transactionId, err } = this.parseData(data);

    return {
      timestamp: new Date(date).valueOf() || null,
      loglevel: loglevel || null,
      transactionId,
      err,
    }
  }

  private parseData(data: string): Pick<ParseResult, 'transactionId' | 'err'> {
    try {
      const { transactionId = null, err = null } = JSON.parse(data);
      return { transactionId, err };
    } catch (error) {
      return { transactionId: null, err: null };
    }
  }

  public filter(data: ParseResult): boolean {
    return data.loglevel === LogLevel.ERROR;
  }
}
