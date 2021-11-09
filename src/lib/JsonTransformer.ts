import { Transformer, Writer } from './interfaces';
import LineParser from './LineParser';

export default class JsonTransformer implements Transformer {
  private lineParser: LineParser;

  constructor() {
    this.lineParser = new LineParser();
  }

  public transform(writer: Writer, line: string) {
    const parsedLine = this.lineParser.parse(line);
    const formattedLine = this.lineParser.format(parsedLine);

    if (this.lineParser.filter(formattedLine)) {
      const jsonString = JSON.stringify(parsedLine);
      writer.write(jsonString);
    }
  }
}
