import { describe, expect, it } from "vitest";

import {
  consultationSchema,
  examResultSchema,
  patientCreateSchema,
  pregnancyClinicalSnapshotSchema,
  signedUploadSchema,
} from "@/lib/validators/schemas";

describe("validators", () => {
  it("accepts a valid patient payload", () => {
    const parsed = patientCreateSchema.parse({
      full_name: "Maria da Silva",
      city: "Petrolina",
    });

    expect(parsed.full_name).toBe("Maria da Silva");
  });

  it("rejects invalid consultation visit index", () => {
    const result = consultationSchema.safeParse({
      visit_index: 0,
    });

    expect(result.success).toBe(false);
  });

  it("accepts predefined exam code", () => {
    const result = examResultSchema.safeParse({
      exam_code: "hiv",
      result_text: "Não reagente",
    });

    expect(result.success).toBe(true);
  });

  it("rejects unknown exam code", () => {
    const result = examResultSchema.safeParse({
      exam_code: "xpto",
      result_text: "Teste",
    });

    expect(result.success).toBe(false);
  });

  it("accepts clinical snapshot defaults", () => {
    const result = pregnancyClinicalSnapshotSchema.parse({});

    expect(result.pregnancy_type).toBe("single");
    expect(result.pregnancy_risk).toBe("habitual");
  });

  it("requires pregnancy id in signed upload", () => {
    const result = signedUploadSchema.safeParse({
      kind: "exam",
      file_name: "laudo.pdf",
    });

    expect(result.success).toBe(false);
  });
});
