export class InvalidPathError implements Error {
  name = 'InvalidPathError';
  message: string;
  constructor(invalidPath: string) {
    this.message = `please set valid path: '${invalidPath}'`;
  }
}
