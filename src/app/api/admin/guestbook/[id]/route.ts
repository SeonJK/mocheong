import { guestbookAdminPatchSchema } from "@/lib/validation";
import { jsonError, jsonOk, configurationError } from "@/lib/api-response";
import { isAdminAuthed } from "@/lib/admin-session";
import { getSupabaseAdminClient } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthed())) {
    return jsonError("unauthorized", "관리자 인증이 필요합니다.", 401);
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return configurationError();
  }

  const parsed = guestbookAdminPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("validation_error", "관리 작업을 확인해 주세요.");
  }

  const { id } = await context.params;
  const action = parsed.data.action;
  const update =
    action === "delete"
      ? { is_visible: false, deleted_at: new Date().toISOString() }
      : { is_visible: action === "show" };

  let query = supabase.from("guestbook_entries").update(update).eq("id", id);
  if (action !== "delete") {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query.select("id").maybeSingle();

  if (error) {
    return jsonError("storage_error", "방명록 상태를 변경하지 못했습니다.", 500);
  }
  if (!data) {
    return jsonError("not_found", "방명록을 찾을 수 없습니다.", 404);
  }

  return jsonOk({ updated: true });
}
