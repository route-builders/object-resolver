import { InvalidJSONError } from '../../src/errors/InvalidJSONError';
import { InvalidPathError } from '../../src/errors/InvalidPathError';
import { PathParser } from '../../src/index';

describe('PathParser: correct cases', () => {
  it('should parse root path.', () => {
    const path = '';
    const parser = new PathParser();
    expect(parser.parse(path)).toEqual([]);
  });

  it('should parse first-level object path.', () => {
    const path = 'FirstLevel';
    const parser = new PathParser();
    expect(parser.parse(path)).toEqual([
      {
        name: 'FirstLevel',
      },
    ]);
  });

  it('should parse first-level array[0] path.', () => {
    const path = 'FirstLevel[0]';
    const parser = new PathParser();
    expect(parser.parse(path)).toEqual([
      {
        name: 'FirstLevel',
        index: 0,
      },
    ]);
  });

  it('should parse first-level array[1] path.', () => {
    const path = 'FirstLevel[1]';
    const parser = new PathParser();
    expect(parser.parse(path)).toEqual([
      {
        name: 'FirstLevel',
        index: 1,
      },
    ]);
  });

  it('should parse first-level array path with json needle.', () => {
    const path = 'FirstLevel[]{"id": 123456}';
    const parser = new PathParser();
    expect(parser.parse(path)).toEqual([
      {
        name: 'FirstLevel',
        selector: { id: 123456 },
      },
    ]);
  });

  it('should parse second-level object path.', () => {
    const path = 'FirstLevel.SecondLevel';
    const parser = new PathParser();
    expect(parser.parse(path)).toEqual([
      {
        name: 'FirstLevel',
      },
      {
        name: 'SecondLevel',
      },
    ]);
  });

  it('should parse second-level array path.', () => {
    const path = 'FirstLevel.SecondLevel[2]';
    const parser = new PathParser();
    expect(parser.parse(path)).toEqual([
      {
        name: 'FirstLevel',
      },
      {
        name: 'SecondLevel',
        index: 2,
      },
    ]);
  });

  it('should parse nesting array-object path.', () => {
    const path = 'FirstLevel[1].SecondLevel[2]';
    const parser = new PathParser();
    expect(parser.parse(path)).toEqual([
      {
        name: 'FirstLevel',
        index: 1,
      },
      {
        name: 'SecondLevel',
        index: 2,
      },
    ]);
  });

  it('should parse with custom delimiter', () => {
    const path = 'FirstLevel/SecondLevel';
    const parser = new PathParser({ namespace_delimiter: '/' });
    expect(parser.parse(path)).toEqual([
      {
        name: 'FirstLevel',
      },
      {
        name: 'SecondLevel',
      },
    ]);
  });
});

describe('PathParser: incorrect cases', () => {
  it('throws error with invalid path-string', () => {
    const invalidPath = 'FirstLevel.ほげ';
    const parser = new PathParser();
    expect(() => {
      parser.parse(invalidPath);
    }).toThrow(InvalidPathError);
  });

  it('throws error with blank namespace', () => {
    const invalidPath = 'FirstLevel.SecondLevel..FourthLevel';
    const parser = new PathParser();
    expect(() => {
      parser.parse(invalidPath);
    }).toThrow(InvalidPathError);
  });

  it('throws error with blank namespace', () => {
    const invalidPath = 'FirstLevel.SecondLevel..FourthLevel';
    const parser = new PathParser();
    expect(() => {
      parser.parse(invalidPath);
    }).toThrow(InvalidPathError);
  });

  it('throws error with 2d-array path.', () => {
    const path = 'FirstLevel[1][2]';
    const parser = new PathParser();
    expect(() => {
      parser.parse(path);
    }).toThrow(InvalidPathError);
  });

  it('throws error with invalid index', () => {
    const invalidPath = 'FirstLevel.SecondLevel[-1]';
    const parser = new PathParser();
    expect(() => {
      parser.parse(invalidPath);
    }).toThrow(InvalidPathError);
  });

  it('throws error with invalid json needle.', () => {
    const path = 'FirstLevel[]{id: 123456}';
    const parser = new PathParser();
    expect(() => {
      parser.parse(path);
    }).toThrow(InvalidJSONError);
  });
});
