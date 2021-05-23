export class ContainsMatrixError implements Error {
  name = 'ContainsMatrixError';
  message: string;
  constructor(invalidPath: string) {
    this.message = `it's include 2d(or more than size) array. not allowed.: '${invalidPath}'`;
  }
}
