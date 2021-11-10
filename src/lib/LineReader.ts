import fs from 'fs';
import readline from 'readline';
import { Reader, Transformer } from './interfaces';

export const onError = () => {
  console.log('Error occurred reading input file');
  process.exit(1);
};

export default class LineReader implements Reader {
  private rl: readline.Interface;

  constructor(input: string) {
    const exist = fs.existsSync(input);
    if (!exist) {
      console.log('Input file does not exist');
      process.exit(1);
    }

    if (exist && fs.lstatSync(input).isDirectory()) {
      console.log('Input can\'t be a directory');
      process.exit(1);
    }

    const rs = fs.createReadStream(input);

    rs.on('error', onError);

    this.rl = readline.createInterface({
      input: rs,
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
