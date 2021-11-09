import fs from 'fs';
import stream from 'stream';
import { Writer } from './interfaces';


export default class LineWriter implements Writer {
  private ws: stream.Writable;

  constructor(output: string) {
    this.ws = fs.createWriteStream(output);

    this.ws.on('close', () => {
      console.log('Logs have been written');
    });
  }

  public write(line: string): void {
    this.ws.write(line);
  }

  public end(): void {
    this.ws.end();
  }
}
