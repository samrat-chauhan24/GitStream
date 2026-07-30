/**
 * Thrown when the dependency graph
 * cannot be constructed.
 */
export class GraphError extends Error {

  constructor(
    message: string
  ) {

    super(message);

    this.name = "GraphError";

  }

}