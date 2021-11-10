import { EOL } from 'os';
import { Transformer, Writer, LogLevel, FormattedLine } from './interfaces';
import LogLine from './LogLine';

export default class JsonTransformer implements Transformer {
  private writer?: Writer;
  private linesWrittenn = 0;

  public pipe(writer: Writer): this {
    this.writer = writer;
    return this;
  }

  public transform(str: string): void {
    if (!this.writer) {
      return;
    }

    const data = new LogLine(str).format();

    if (!this._filter(data)) {
      return;
    }

    const jsonString = this._toString(data);
    const prefix = this.linesWrittenn === 0 ? `[${EOL}` : `,${EOL}`;
    this.writer.write(`${prefix}\t${jsonString}`);

    this.linesWrittenn++;
  }

  public end() {
    if (!this.writer) {
      return;
    }

    if (this.linesWrittenn === 0) {
      this.writer.end();
      return;
    }

    this.writer.write(`${EOL}]${EOL}`);
    this.writer.end();
  }

  private _filter(data: FormattedLine): boolean {
    return data.loglevel === LogLevel.ERROR;
  }

  private _toString(data: FormattedLine): string {
    return JSON.stringify(data);
  }
}
