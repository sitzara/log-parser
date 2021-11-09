import { EOL } from 'os';
import JsonTransformer from './JsonTransformer';
import LineWriter from './LineWriter';

const writeMock = jest.fn();
const endMock = jest.fn();
jest.mock('./LineWriter', () => {
  return jest.fn().mockImplementation(() => {
    return { write: writeMock, end: endMock };
  });
});

const formatMock = jest.fn();
jest.mock('./LogLine', () => {
  return jest.fn().mockImplementation(() => {
    return { format: formatMock };
  });
});

describe('pipe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return this', () => {
    const writer = new LineWriter('');
    const transformer = new JsonTransformer();
    expect(transformer.pipe(writer)).toBe(transformer);
  });
});

describe('JsonTransformer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should do nothing if writer is not piped', () => {
    const transformer = new JsonTransformer();
    transformer.transform('');
    expect(writeMock).not.toHaveBeenCalled();
  });

  test('should do nothing if writer is not piped', () => {
    const transformer = new JsonTransformer();
    transformer.end();
    expect(writeMock).not.toHaveBeenCalled();
  });

  test('should write error lines', () => {
    const writer = new LineWriter('');
    const transformer = new JsonTransformer();
    transformer.pipe(writer);

    const errorData = { loglevel: 'error' };
    const jsonString = '{"loglevel":"error"}';

    formatMock.mockImplementation(() => errorData);

    const line1 = 'date - error - {}';
    const line2 = 'date - error - {}';

    transformer.transform(line1);
    transformer.transform(line2);
    transformer.end();

    expect(writeMock.mock.calls[0][0]).toBe(`[${EOL}\t${jsonString}`);
    expect(writeMock.mock.calls[1][0]).toBe(`,${EOL}\t${jsonString}`);
    expect(writeMock.mock.calls[2][0]).toBe(`${EOL}]${EOL}`);
    expect(endMock).toHaveBeenCalledWith();
    expect(endMock).toHaveBeenCalledTimes(1);
  });

  test('should not write not error lines', () => {
    const writer = new LineWriter('');
    const transformer = new JsonTransformer();
    transformer.pipe(writer);

    const errorData = { loglevel: 'error' };
    const infoData = { loglevel: 'info' };
    const jsonErrorString = '{"loglevel":"error"}';

    formatMock.mockImplementationOnce(() => errorData);
    formatMock.mockImplementationOnce(() => infoData);

    const line1 = 'date - error - {}';
    const line2 = 'date - info - {}';

    transformer.transform(line1);
    transformer.transform(line2);
    transformer.end();

    expect(writeMock.mock.calls[0][0]).toBe(`[${EOL}\t${jsonErrorString}`);
    expect(writeMock.mock.calls[1][0]).toBe(`${EOL}]${EOL}`);
    expect(endMock).toHaveBeenCalledWith();
    expect(endMock).toHaveBeenCalledTimes(1);
  });
});