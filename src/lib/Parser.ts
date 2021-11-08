import fs from 'fs';
import readline from 'readline';
import Writer from './Writer';

export default class Parser {
  input: string;
  output: string;
  rl: readline.Interface;

  public constructor(input: string, output: string) {
    this.input = input;
    this.output = output;

    if (!fs.existsSync(input)) {
      throw new Error('Input file does not exist');
    }

    this.rl = readline.createInterface({
      input: fs.createReadStream(this.input),
      terminal: false,
      crlfDelay: Infinity
    });
  }

  public run() {
    const ws = fs.createWriteStream(this.output);
    const writer = new Writer(ws);

    this.rl.on('line', (line) => {
      console.log(line);
      writer.add(line);
    });

    this.rl.on('close', () => {
      console.log('readline closed');
      writer.end();
    });
  }
}
