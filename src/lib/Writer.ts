import { EOL } from 'os';
import stream from 'stream';
import LineParser from './LineParser';

interface Data {
  timestamp: number | null;
  loglevel: string | null;
  transactionId: string | null;
  err: string | null;
}

export default class Writer {
  private ws: stream.Writable;
  private lineParser: LineParser;
  private linesWritten = 0;

  constructor(ws: stream.Writable) {
    // OR CREATE stream HERE
    this.ws = ws;

    this.ws.on('close', () => {
      console.log('Writable stream closed');
    });

    this.lineParser = new LineParser();
  }

  public add(line: string): void {
    const parsedLine = this.lineParser.parse(line);
    // ADD FILTERING HERE

    const jsonString = JSON.stringify(parsedLine);
    const prefix = this.linesWritten === 0 ? `[${EOL}` : `,${EOL}`;

    this.ws.write(`${prefix}\t${jsonString}`);

    this.linesWritten++;
  }

  public end() {
    if (this.linesWritten === 0) {
      this.ws.end();
    }
    this.ws.end(`${EOL}]`);
  }
}
