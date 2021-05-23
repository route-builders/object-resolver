import { InvalidDocumentError } from 'src/errors/InvalidDocumentError';
import { NonExistNamespaceError } from 'src/errors/NonExistNamespaceError';
import { PathParser } from 'src/lib/PathParser';
import { Document } from 'src/types/Document';
import { ObjectResolverOption } from 'src/types/ObjectResolverOption';
import { ResolvedDocument } from 'src/types/ResolvedDocument';

const objectResolverOptionDefault: ObjectResolverOption = {
  namespace_delimiter: '.',
};

export class ObjectResolver {
  private document: Document;
  private option: ObjectResolverOption;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  constructor(document: any, option?: ObjectResolverOption) {
    try {
      this.document = document;
    } catch (error) {
      throw new InvalidDocumentError();
    }
    this.option = { ...objectResolverOptionDefault, ...option };
  }

  public resolve(path: string): ResolvedDocument {
    const parser = new PathParser({ namespace_delimiter: this.option.namespace_delimiter });
    const routes = parser.parse(path);

    let cursor: ResolvedDocument = this.document;

    for (const route of routes) {
      const next: string | Document | Document[] = cursor[route.name];
      const idx = route.index;

      // string, object
      if (typeof idx === 'undefined' && (typeof next === 'object' || typeof next === 'string')) {
        cursor = next;
        continue;
      }

      // array
      if (typeof idx === 'number' && Array.isArray(next)) {
        cursor = <ResolvedDocument>next[idx];
        continue;
      }

      // other
      throw new NonExistNamespaceError(path);
    }

    return cursor;
  }
}
