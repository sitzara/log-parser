import LineReader from './LineReader';
import JsonTransformer from './JsonTransformer';
import JsonWriter from './JsonWriter';

export default class Parser {
  reader: LineReader;
  transformer: JsonTransformer;
  writer: JsonWriter;

  public constructor(input: string, output: string) {
    this.reader = new LineReader(input);
    this.transformer = new JsonTransformer();
    this.writer = new JsonWriter(output);
  }

  public run() {
    this.reader.transformer(this.transformer).pipe(this.writer);
  }
}
