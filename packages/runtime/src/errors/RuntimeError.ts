/**
 * Represents an error thrown by the GitStream runtime.
 */
export class RuntimeError extends Error {

  constructor(
    message: string,
  ) {

    super(message);

    this.name = "RuntimeError";

  }

}