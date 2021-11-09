import { Line, LogLevel, ParsedLine, ParsedLineData, FormattedLine } from './interfaces';

export default class LogLine implements Line<FormattedLine> {
  public str: string;
  private parsedData: ParsedLine;

  public constructor(str: string) {
    this.str = str;

    this.parsedData = this._parse(str);
  }

  private _parse(str: string): ParsedLine {
    const [date, loglevel, data] = str.split(' - ');
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

  public format(): FormattedLine {
    const { date, loglevel, data } = this.parsedData;
    return {
      timestamp: new Date(date || '').valueOf() || null,
      loglevel: loglevel as LogLevel || '',
      transactionId: data?.transactionId || '',
      err: data?.err || '',
    }
  }

  public getParsedData(): ParsedLine {
    return this.parsedData;
  }
}
