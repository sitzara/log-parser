import fs from 'fs';
import readline from 'readline';
import { Reader, Writer, Transformer } from './interfaces';

export default class LineReader implements Reader {
  private input: string;
  private rl: readline.Interface;
  private _transformer?: Transformer;

  constructor(input: string) {
    if (!fs.existsSync(input)) {
      throw new Error('Input file does not exist');
    }

    this.input = input;

    this.rl = readline.createInterface({
      input: fs.createReadStream(this.input),
      terminal: false,
      crlfDelay: Infinity
    });
  }

  public pipe(writer: Writer): Writer {
    this.rl.on('line', (line) => {
      if (this._transformer) {
        this._transformer.transform(writer, line);
        return;
      }
      writer.write(line);
    });

    this.rl.on('close', () => {
      writer.end();
    });

    return writer;
  }

  public transformer(transformer: Transformer): this {
    this._transformer = transformer;
    return this;
  }
}
