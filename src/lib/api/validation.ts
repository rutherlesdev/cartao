import { z } from "zod";

import { ApiError } from "@/lib/api/errors";

export const uuidSchema = z.uuid();

export function getUuidParam(value: string, fieldName: string) {
  const parsed = uuidSchema.safeParse(value);
  if (!parsed.success) {
    throw ApiError.badRequest(`Parâmetro inválido: ${fieldName}`);
  }

  return parsed.data;
}

export async function parseJson<T>(request: Request, schema: z.ZodType<T>) {
  const body = await request.json();
  return schema.parse(body);
}
