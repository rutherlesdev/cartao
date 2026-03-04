import type { NextRequest } from "next/server";

import { requireAuth } from "@/lib/api/auth";
import { withErrorBoundary } from "@/lib/api/response";
import type { AppRole } from "@/lib/domain/types";

type HandlerContext = {
  params?: Promise<Record<string, string | string[] | undefined>>;
};

type AuthenticatedInput = {
  request: NextRequest;
  profile: Awaited<ReturnType<typeof requireAuth>>["profile"];
  supabase: Awaited<ReturnType<typeof requireAuth>>["supabase"];
  user: Awaited<ReturnType<typeof requireAuth>>["user"];
  context: HandlerContext;
};

export function withAuth(
  fn: (input: AuthenticatedInput) => Promise<Response>,
  options?: { allowRoles?: readonly AppRole[] },
) {
  return async function wrapped(request: NextRequest, context: HandlerContext) {
    return withErrorBoundary(async () => {
      const auth = await requireAuth({ allowRoles: options?.allowRoles });
      return fn({
        request,
        profile: auth.profile,
        supabase: auth.supabase,
        user: auth.user,
        context,
      });
    });
  };
}
