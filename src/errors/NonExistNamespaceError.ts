export class NonExistNamespaceError implements Error {
  name = 'NonExistNamespaceError';
  message: string;
  constructor(invalidPath: string) {
    this.message = `please set valid path: '${invalidPath}'`;
  }
}
