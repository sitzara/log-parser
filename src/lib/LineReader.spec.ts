import fs from 'fs';
import LineReader from './LineReader';

jest.mock('fs');

const mockProcessExit = jest.spyOn(process, 'exit')
  .mockImplementation((number) => { throw new Error('process.exit: ' + number); });

describe('LineReader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should call process.exit(1) if input file does not exist', () => {
      (fs.existsSync as any).mockImplementation(() => false);

      const createLinReader = () => new LineReader('./app.logs');
      expect(createLinReader).toThrowError('process.exit: 1');
      expect(mockProcessExit).toHaveBeenCalled();
    });

    test('should call process.exit(1) if input is directory', () => {
      (fs.existsSync as any).mockImplementation(() => true);
      (fs.lstatSync as any).mockImplementation(() => ({
        isDirectory: jest.fn(() => true),
      }));

      const createLinReader = () => new LineReader('./');
      expect(createLinReader).toThrowError('process.exit: 1');
      expect(mockProcessExit).toHaveBeenCalled();
    });
  });
});
