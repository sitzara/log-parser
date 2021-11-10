import LineReader from './LineReader';
import JsonTransformer from './JsonTransformer';
import LineWriter from './LineWriter';

export default class Parser {
  reader: LineReader;
  transformer: JsonTransformer;
  writer: LineWriter;

  public constructor(input: string, output: string) {
    this.reader = new LineReader(input);
    this.transformer = new JsonTransformer();
    this.writer = new LineWriter(output);

    console.log(`Parsing logs from "${input}" to "${output}"`);
  }

  public run() {
    this.reader.pipe(this.transformer.pipe(this.writer));
  }
}
