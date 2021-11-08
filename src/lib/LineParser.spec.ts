import LineParser from './LineParser';

const parser = new LineParser();

describe('parse', () => {
  test('should parse line 1', () => {
    const result = parser.parse('2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404,"err":"Not found"}');
    expect(result).toEqual({
      timestamp: 1628475171259,
      loglevel: 'error',
      transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978',
      err: 'Not found',
    });
  });

  test('should parse line 2', () => {
    const result = parser.parse(' - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404,"err":"Not found"}');
    expect(result).toEqual({
      timestamp: null,
      loglevel: null,
      transactionId: null,
      err: null,
    });
  });

  test('should parse line 3', () => {
    const result = parser.parse('2021-08-09T02:12:51.259Z - invalid - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404,"err":"Not found"}');
    expect(result).toEqual({
      timestamp: null,
      loglevel: null,
      transactionId: null,
      err: null,
    });
  });

  test('should parse line 4', () => {
    const result = parser.parse('2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Cannot find user orders list","code": 404}');
    expect(result).toEqual({
      timestamp: 1628475171259,
      loglevel: 'error',
      transactionId: '9abc55b2-807b-4361-9dbe-aa88b1b2e978',
      err: null,
    });
  });

  test('should parse line 5', () => {
    const result = parser.parse('2021-08-09T02:12:51.259Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978",}');
    expect(result).toEqual({
      timestamp: 1628475171259,
      loglevel: 'error',
      transactionId: null,
      err: null,
    });
  });
});
