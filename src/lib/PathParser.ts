import { InvalidPathError } from 'src/errors/InvalidPathError';
import { PathParserOption } from 'src/types/PathParserOption';
import { Route } from 'src/types/Route';

const NAMESPACE_DELIMITER = '.';
const OBJECT_REGEX = /^([A-Za-z0-9_]+)$/;
const ARRAY_REGEX = /^([A-Za-z0-9_]+)((?:\[\d+\])+)$/;

const pathParserOptionDefault: PathParserOption = {
  namespace_delimiter: NAMESPACE_DELIMITER,
};

export class PathParser {
  private option: PathParserOption;
  constructor(option?: PathParserOption) {
    this.option = { ...pathParserOptionDefault, ...option };
  }

  public parse(path: string): Route[] {
    const routes: Route[] = [];
    if (path.length === 0) {
      return routes;
    }

    const namespaces = path.split(this.option.namespace_delimiter);
    for (const namespace of namespaces) {
      const objectMatcher = namespace.match(OBJECT_REGEX);
      if (objectMatcher && objectMatcher[1]) {
        routes.push({ name: objectMatcher[1] });
        continue;
      }

      const arrayMatcher = namespace.match(ARRAY_REGEX);
      if (arrayMatcher && arrayMatcher[1] && arrayMatcher[2]) {
        const name = arrayMatcher[1];
        const indexes: number[] = arrayMatcher[2]
          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .split('][')
          .map((v) => parseInt(v));

        if (indexes.length !== 1) {
          // hang error
          throw new InvalidPathError(path);
        }
        routes.push({ name, index: indexes[0] });
        continue;
      }

      // hang error
      throw new InvalidPathError(path);
    }

    return routes;
  }
}
