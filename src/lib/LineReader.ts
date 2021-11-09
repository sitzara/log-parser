import fs from 'fs';
import readline from 'readline';
import { Reader, Transformer } from './interfaces';

export default class LineReader implements Reader {
  private rl: readline.Interface;

  constructor(input: string) {
    if (!fs.existsSync(input)) {
      throw new Error('Input file does not exist');
    }

    this.rl = readline.createInterface({
      input: fs.createReadStream(input),
      terminal: false,
      crlfDelay: Infinity
    });
  }

  public pipe(transformer: Transformer): this {
    this.rl.on('line', (line) => {
      transformer.transform(line);
    });

    this.rl.on('close', () => {
      transformer.end();
    });

    return this;
  }
}
