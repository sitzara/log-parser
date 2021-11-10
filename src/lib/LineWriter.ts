import fs from 'fs';
import stream from 'stream';
import { Writer } from './interfaces';

export const onError = () => {
  console.log('Error occurred writing to output file');
  process.exit(1);
};

export const onClose = () => {
  console.log('Completed');
}

export default class LineWriter implements Writer {
  private ws: stream.Writable;

  constructor(output: string) {
    if (fs.existsSync(output) && fs.lstatSync(output).isDirectory()) {
      console.log('Output can\'t be a directory');
      process.exit(1);
    }

    this.ws = fs.createWriteStream(output);

    this.ws.on('error', onError);
    this.ws.on('close', onClose);
  }

  public write(line: string): void {
    this.ws.write(line);
  }

  public end(): void {
    this.ws.end();
  }
}
