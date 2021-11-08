import { EOL } from 'os';
import stream from 'stream';
import LineParser from './LineParser';

interface Data {
  timestamp: number | null;
  loglevel: string | null;
  transactionId: string | null;
  err: string | null;
}

export default class BunchWriter {
  private ws: stream.Writable;
  private lineParser: LineParser;
  public lines: string[] = [];

  constructor(ws: stream.Writable) {
    // OR CREATE stream HERE
    this.ws = ws;

    this.ws.on('close', () => {
      console.log('Writable stream closed');
    });

    this.lineParser = new LineParser();
  }

  public add(line: string): void {
    const jsonString = JSON.stringify(this.lineParser.parse(line));
    this.lines.push(jsonString);
  }

  public end() {
    if (this.lines.length === 0) return;

    this.ws.write(`[${EOL}`);

    this.lines.forEach((line, i) => {
      this.ws.write(`\t${line}${i < this.lines.length - 1 ? ',' : ''}${EOL}`);
    })

    this.ws.write(`]`);
    this.ws.end();
  }
}