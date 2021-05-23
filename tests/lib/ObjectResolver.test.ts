import { InvalidPathError } from '../../src/errors/InvalidPathError';
import { NonExistNamespaceError } from '../../src/errors/NonExistNamespaceError';
import { ObjectResolver } from '../../src/index';

describe('ObjectResolver: correct cases', () => {
  it('should resolve blank object', () => {
    const doc = {};
    const resolver = new ObjectResolver(doc);
    expect(resolver.resolve('')).toEqual({});
  });

  it('should resolve string', () => {
    const doc = { FirstLevel: { name: 'taro' } };
    const resolver = new ObjectResolver(doc);
    expect(resolver.resolve('FirstLevel.name')).toBe('taro');
  });

  it('should resolve first-level object', () => {
    const doc = { FirstLevel: { name: 'taro' } };
    const resolver = new ObjectResolver(doc);
    expect(resolver.resolve('FirstLevel')).toEqual({ name: 'taro' });
  });

  it('should resolve first-level array', () => {
    const doc = { FirstLevel: [{ name: 'taro' }, { name: 'jiro' }] };
    const resolver = new ObjectResolver(doc);
    expect(resolver.resolve('FirstLevel[1]')).toEqual({ name: 'jiro' });
  });

  it('should resolve first-level array with json selector', () => {
    const doc = {
      FirstLevel: [
        { id: 123, name: 'taro' },
        { id: 456, name: 'jiro' },
      ],
    };
    const resolver = new ObjectResolver(doc);
    expect(resolver.resolve('FirstLevel[]{"id": 123}')).toEqual({ id: 123, name: 'taro' });
  });

  it('should resolve second-level object', () => {
    const doc = { FirstLevel: { SecondLevel: { name: 'taro' } } };
    const resolver = new ObjectResolver(doc);
    expect(resolver.resolve('FirstLevel.SecondLevel')).toEqual({ name: 'taro' });
  });

  it('should resolve second-level array', () => {
    const doc = { FirstLevel: { SecondLevel: [{ name: 'taro' }, { name: 'jiro' }] } };
    const resolver = new ObjectResolver(doc);
    expect(resolver.resolve('FirstLevel.SecondLevel[1]')).toEqual({ name: 'jiro' });
  });
});

describe('ObjectResolver: incorrect cases', () => {
  it('throws error non-exist path with blank object', () => {
    const doc = {};
    const resolver = new ObjectResolver(doc);
    expect(() => {
      resolver.resolve('DummyNamespace');
    }).toThrow(NonExistNamespaceError);
  });

  it('throws error non-exist path with non-blank object', () => {
    const doc = { hoge: 'fuga' };
    const resolver = new ObjectResolver(doc);
    expect(() => {
      resolver.resolve('DummyNamespace');
    }).toThrow(NonExistNamespaceError);
  });

  // known issue: not support matrix
  it('cannot resolve 2d-array', () => {
    const doc = {
      FirstLevel: [
        [{ name: 'taro' }, { name: 'jiro' }],
        [{ name: 'hanako' }, { name: 'kaori' }],
      ],
    };
    const resolver = new ObjectResolver(doc);
    expect(() => {
      resolver.resolve('FirstLevel[1][0]');
    }).toThrow(InvalidPathError);
  });

  it('throws error non-exist json selector(1)', () => {
    const doc = {
      FirstLevel: [
        { id: 123, name: 'taro' },
        { id: 456, name: 'jiro' },
      ],
    };
    const resolver = new ObjectResolver(doc);
    expect(() => {
      resolver.resolve('FirstLevel[]{"id": 123, "name": "hanako"}');
    }).toThrow(NonExistNamespaceError);
  });

  it('throws error non-exist json selector(2)', () => {
    const doc = {
      FirstLevel: [
        { id: 123, name: 'taro' },
        { id: 456, name: 'jiro' },
      ],
    };
    const resolver = new ObjectResolver(doc);
    expect(() => {
      resolver.resolve('FirstLevel[]{"id": 123, "name": "taro", "height": 170}');
    }).toThrow(NonExistNamespaceError);
  });
});
