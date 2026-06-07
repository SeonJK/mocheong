import { rsvpSchema } from "@/lib/validation";
import { configurationError, jsonError, jsonOk } from "@/lib/api-response";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const parsed = rsvpSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("validation_error", parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return configurationError();
  }

  const payload = parsed.data;
  const { error } = await supabase.from("rsvps").insert({
    client_request_id: payload.clientRequestId,
    side: payload.side,
    attendance: payload.attendance,
    meal: payload.meal ?? null,
    name: payload.name,
    phone: payload.phone || null,
    companion_count: payload.companionCount,
    companion_names: payload.companionNames || null,
    memo: payload.memo || null,
    privacy_agreed_at: new Date().toISOString()
  });

  if (error) {
    if (error.code === "23505") {
      return jsonOk({ submitted: true, duplicate: true });
    }

    return jsonError("storage_error", "참석 답변 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.", 500);
  }

  return jsonOk({ submitted: true, duplicate: false });
}
