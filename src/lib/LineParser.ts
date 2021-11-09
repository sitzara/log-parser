import { Parser, LogLevel, ParsedLine, ParsedLineData, FormattedLine } from './interfaces';

export default class LineParser implements Parser {
  private regexp = /^([A-Za-z0-9-:\.]+)\s-\s(info|debug|error|warn)\s-\s(.+)?$/i;

  public parse(str: string): ParsedLine  {
    const result = this.regexp.exec(str);
    if (!result) return {};

    const date = result[1];
    const loglevel = result[2];
    const data = result[3];
    const parsedData = this._parseData(data);

    return {
      date,
      loglevel,
      data: parsedData,
    }
  }

  private _parseData(data: string): ParsedLineData {
    try {
      const parsedData: ParsedLineData = JSON.parse(data);
      return parsedData;
    } catch (error) {
      return {};
    }
  }

  public format(line: ParsedLine): FormattedLine {
    const { date, loglevel, data } = line;
    return {
      timestamp: new Date(date || '').valueOf() || null,
      loglevel: loglevel as LogLevel || '',
      transactionId: data?.transactionId || '',
      err: data?.err || '',
    }
  }

  public filter(line: FormattedLine): boolean {
    return line.loglevel === LogLevel.ERROR;
  }
}
