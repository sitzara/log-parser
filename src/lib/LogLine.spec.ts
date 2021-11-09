import LogLine from './LogLine';

describe('LogLine', () => {
  describe('_parse', () => {
    test('should parse line', () => {
      const str = '2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404,"err":"Not found"}';
      const line = new LogLine(str);

      expect(line.getParsedData()).toEqual({
        date: '2021-08-09T02:12:51.259Z',
        loglevel: 'error',
        data: {
          transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978',
          details: 'Cannot find user orders list',
          code: 404,
          err: 'Not found',
        },
      });
    });

    test('should return empty object for data part if it is non valid JSON', () => {
      const str = '2021-08-09T02:12:51.259Z - error - {"transactionId"}';
      const line = new LogLine(str);

      expect(line.getParsedData()).toEqual({
        date: '2021-08-09T02:12:51.259Z',
        loglevel: 'error',
        data: {},
      });
    });

    test('should return empty string for date if it is not valid', () => {
      const str = ' - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404,"err":"Not found"}';
      const line = new LogLine(str);

      expect(line.getParsedData()).toEqual({
        date: '',
        loglevel: 'error',
        data: {
          transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978',
          details: 'Cannot find user orders list',
          code: 404,
          err: 'Not found',
        },
      });
    });
  });

  describe('format', () => {
    test('should format parsed data', () => {
      const str = '2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404,"err":"Not found"}';
      const line = new LogLine(str);

      expect(line.format()).toEqual({
        timestamp: 1628475171259,
        loglevel: 'error',
        transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978',
        err: 'Not found',
      });
    });

    test('should return null for timestamp if date is not valid', () => {
      const str = ' - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404,"err":"Not found"}';
      const line = new LogLine(str);

      expect(line.format()).toEqual({
        timestamp: null,
        loglevel: 'error',
        transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978',
        err: 'Not found',
      });
    });

    test('should return err as ampty string if it is not in data', () => {
      const str = '2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404}';
      const line = new LogLine(str);
      expect(line.format()).toEqual({
        timestamp: 1628475171259,
        loglevel: 'error',
        transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978',
        err: '',
      });
    });

    test('should return empty strings for err and transactionId if data part is non valid JSON', () => {
      const str = '2021-08-09T02:12:51.259Z - error - {"transactionId"}';
      const line = new LogLine(str);
      expect(line.format()).toEqual({
        timestamp: 1628475171259,
        loglevel: 'error',
        transactionId: '',
        err: '',
      });
    });
  });
});
