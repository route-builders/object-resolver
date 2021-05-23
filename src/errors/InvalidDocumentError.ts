export class InvalidDocumentError implements Error {
  name = 'InvalidDocumentError';
  message: string;
  constructor() {
    this.message = `invalid document (maybe include 2d(or more than size) array)`;
  }
}
