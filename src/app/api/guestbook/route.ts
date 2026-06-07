import { guestbookSchema } from "@/lib/validation";
import { configurationError, jsonError, jsonOk } from "@/lib/api-response";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return configurationError();
  }

  const { data, error } = await supabase
    .from("guestbook_entries")
    .select("id,name,message,created_at")
    .eq("is_visible", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    return jsonError("storage_error", "방명록을 불러오지 못했습니다.", 500);
  }

  return jsonOk({ entries: data ?? [] });
}

export async function POST(request: Request) {
  const parsed = guestbookSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("validation_error", parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return configurationError();
  }

  const payload = parsed.data;
  const { error } = await supabase.from("guestbook_entries").insert({
    client_request_id: payload.clientRequestId,
    name: payload.name,
    message: payload.message
  });

  if (error) {
    if (error.code === "23505") {
      return jsonOk({ submitted: true, duplicate: true });
    }

    return jsonError("storage_error", "방명록 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.", 500);
  }

  return jsonOk({ submitted: true, duplicate: false });
}
