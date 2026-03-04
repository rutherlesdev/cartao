export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, "bad_request", message, details);
  }

  static unauthorized(message = "Não autenticado") {
    return new ApiError(401, "unauthorized", message);
  }

  static forbidden(message = "Sem permissão para esta operação") {
    return new ApiError(403, "forbidden", message);
  }

  static notFound(message = "Registro não encontrado") {
    return new ApiError(404, "not_found", message);
  }

  static conflict(message: string, details?: unknown) {
    return new ApiError(409, "conflict", message, details);
  }

  static internal(message = "Erro interno") {
    return new ApiError(500, "internal_error", message);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
