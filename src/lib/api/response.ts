import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ApiError, isApiError } from "@/lib/api/errors";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function mapError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Payload inválido",
          details: error.flatten(),
        },
      },
      { status: 422 },
    );
  }

  if (isApiError(error)) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.status },
    );
  }

  console.error("[api:error]", error);
  const fallback = ApiError.internal();
  return NextResponse.json(
    {
      error: {
        code: fallback.code,
        message: fallback.message,
      },
    },
    { status: fallback.status },
  );
}

export async function withErrorBoundary<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (error) {
    return mapError(error);
  }
}
