import { jsonError, jsonOk, configurationError } from "@/lib/api-response";
import { isAdminAuthed } from "@/lib/admin-session";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return jsonError("unauthorized", "관리자 인증이 필요합니다.", 401);
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return configurationError();
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return jsonError("storage_error", "RSVP 목록을 불러오지 못했습니다.", 500);
  }

  return jsonOk({ rsvps: data ?? [] });
}
