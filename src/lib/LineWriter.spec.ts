
import fs from 'fs';
import LineWriter, { onError, onClose } from './LineWriter';

const wsMock = { on: jest.fn() };
jest.mock('fs');

const mockProcessExit = jest.spyOn(process, 'exit')
  .mockImplementation((number) => { throw new Error('process.exit: ' + number); });

describe('LineWriter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should set callbacks in constructor', () => {
      (fs.createWriteStream as any).mockImplementation(() => wsMock);

      new LineWriter('./error.json');

      expect(wsMock.on.mock.calls[0][0]).toBe('error');
      expect(wsMock.on.mock.calls[0][1]).toBe(onError);
      expect(wsMock.on.mock.calls[1][0]).toBe('close');
      expect(wsMock.on.mock.calls[1][1]).toBe(onClose);
    });

    test('should call process.exit(1) if input is directory', () => {
      (fs.existsSync as any).mockImplementation(() => true);
      (fs.lstatSync as any).mockImplementation(() => ({
        isDirectory: jest.fn(() => true),
      }));
      const createLineWriter = () => new LineWriter('./');

      expect(createLineWriter).toThrowError('process.exit: 1');
    });
  });
});

describe('onError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call process.exit(1)', () => {
    const callOnError = () => onError();
    expect(callOnError).toThrowError('process.exit: 1');
    expect(mockProcessExit).toHaveBeenCalled();
  });
})
