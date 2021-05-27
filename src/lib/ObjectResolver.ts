import { InvalidDocumentError } from '../errors/InvalidDocumentError';
import { NonExistNamespaceError } from '../errors/NonExistNamespaceError';
import { PathParser } from '../lib/PathParser';
import { Document } from '../types/Document';
import { ObjectResolverOption } from '../types/ObjectResolverOption';
import { ResolvedDocument } from '../types/ResolvedDocument';
import { JSONSelector } from '../types/Route';

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
      const selector = route.selector;

      // string, object
      if (
        typeof idx === 'undefined' &&
        typeof selector === 'undefined' &&
        (typeof next === 'object' || typeof next === 'string')
      ) {
        cursor = next;
        continue;
      }

      // object with selector
      if (typeof idx === 'undefined' && typeof selector === 'object' && Array.isArray(next)) {
        const findResult = this.findBy(selector, next);
        if (findResult) {
          cursor = findResult;
          continue;
        } else {
          throw new NonExistNamespaceError(path);
        }
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

  private findBy(jsonSelector: JSONSelector, source: Document[]): Document | undefined {
    for (const choice of source) {
      if (this.isValid(jsonSelector, choice)) {
        return choice;
      }
    }

    return undefined;
  }

  private isValid(jsonSelector: JSONSelector, choice: Document): boolean {
    for (const key in jsonSelector) {
      if (Object.prototype.hasOwnProperty.call(jsonSelector, key)) {
        if (typeof choice[key] === 'undefined') {
          return false;
        } else if (typeof jsonSelector[key] === 'string' && choice[key] !== jsonSelector[key]) {
          return false;
        } else if (typeof jsonSelector[key] === 'object' && typeof choice[key] !== 'object') {
          return false;
        } else if (
          typeof jsonSelector[key] === 'object' &&
          JSON.stringify(choice[key]) !== JSON.stringify(jsonSelector[key])
        ) {
          return false;
        }
      }
    }
    return true;
  }
}
