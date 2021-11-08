import yargs from 'yargs/yargs';
import path from 'path';
import Parser from './lib/Parser';

interface Arguments {
  [x: string]: unknown;
  input: string;
  output: string;
}

const argv: Arguments = yargs(process.argv.slice(2)).options({
  input: { type: 'string', demandOption: true },
  output: { type: 'string', demandOption: true },
}).parseSync();

console.log('argv', argv.input, argv.output);

const inputPath = path.resolve(__dirname, '../', argv.input);
const outputPath = path.resolve(__dirname, '../', argv.output);

new Parser(inputPath, outputPath).run();
