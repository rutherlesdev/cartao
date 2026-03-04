import type { AppRole, UserProfile } from "@/lib/domain/types";
import { ApiError } from "@/lib/api/errors";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

type RequireAuthOptions = {
  allowRoles?: readonly AppRole[];
};

export async function requireAuth(options?: RequireAuthOptions) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw ApiError.unauthorized();
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id,user_id,clinic_id,role,display_name")
    .eq("user_id", user.id)
    .single<UserProfile>();

  if (profileError || !profile) {
    throw ApiError.forbidden("Perfil de usuário não configurado");
  }

  if (options?.allowRoles && !options.allowRoles.includes(profile.role)) {
    throw ApiError.forbidden();
  }

  return {
    supabase,
    user,
    profile,
  };
}

export function assertStaff(role: AppRole) {
  if (role === "doctor" || role === "secretary" || role === "admin") {
    return;
  }

  throw ApiError.forbidden("Apenas equipe clínica pode editar dados");
}
