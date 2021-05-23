export class InvalidJSONError implements Error {
  name = 'InvalidJSONError';
  message: string;
  constructor(jsonString: string) {
    this.message = `please set valid JSON: '${jsonString}'`;
  }
}
