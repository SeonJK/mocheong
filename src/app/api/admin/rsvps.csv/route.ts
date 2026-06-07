import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-session";
import { jsonError, configurationError } from "@/lib/api-response";
import { toCsv } from "@/lib/csv";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
  if (!(await isAdminAuthed())) {
    return jsonError("unauthorized", "관리자 인증이 필요합니다.", 401);
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return configurationError();
  }

  const { data, error } = await supabase.from("rsvps").select("*").order("created_at", { ascending: false });

  if (error) {
    return jsonError("storage_error", "CSV를 생성하지 못했습니다.", 500);
  }

  const csv = toCsv((data ?? []) as Record<string, string | number | boolean | null>[]);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"rsvps.csv\""
    }
  });
}
