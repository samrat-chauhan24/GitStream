/**
 * Thrown when the resolver encounters
 * an invalid resolution request.
 */
export class ResolutionError extends Error {

  constructor(message: string) {

    super(message);

    this.name = "ResolutionError";

  }

}