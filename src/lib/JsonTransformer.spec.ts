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

describe('JsonTransformer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('pipe', () => {
    test('should return this', () => {
      const writer = new LineWriter('');
      const transformer = new JsonTransformer();
      expect(transformer.pipe(writer)).toBe(transformer);
    });
  });

  test('should do nothing if writer is not piped', () => {
    const transformer = new JsonTransformer();
    transformer.transform('');
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

  test('should not write if no lines were transformed', () => {
    const writer = new LineWriter('');
    const transformer = new JsonTransformer();
    transformer.pipe(writer);

    transformer.end();

    expect(writeMock).not.toHaveBeenCalled();
    expect(endMock).toHaveBeenCalledWith();
    expect(endMock).toHaveBeenCalledTimes(1);
  });
});