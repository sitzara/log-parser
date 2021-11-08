import { EOL } from 'os';
import fs from 'fs';
import stream from 'stream';
// import LineParser from './LineParser';
import { Writer } from './interfaces';


export default class JsonWriter implements Writer {
  private ws: stream.Writable;
  // private lineParser: LineParser;
  private linesWritten = 0;

  constructor(output: string) {
    this.ws = fs.createWriteStream(output);

    this.ws.on('close', () => {
      console.log('Logs have been written');
    });

    // this.lineParser = new LineParser();
  }

  public write(line: string): void {
    const prefix = this.linesWritten === 0 ? `[${EOL}` : `,${EOL}`;

    this.ws.write(`${prefix}\t${line}`);

    this.linesWritten++;
  }

  public end() {
    if (this.linesWritten === 0) {
      this.ws.end();
    }
    this.ws.end(`${EOL}]${EOL}`);
  }
}
