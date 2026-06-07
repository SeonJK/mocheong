import { adminLoginSchema } from "@/lib/validation";
import {
  clearAdminSession,
  createAdminSession,
  hasAdminPassword,
  isAdminAuthed,
  verifyAdminPassword
} from "@/lib/admin-session";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function GET() {
  const configured = hasAdminPassword();
  return jsonOk({
    configured,
    authenticated: configured ? await isAdminAuthed() : false
  });
}

export async function POST(request: Request) {
  if (!hasAdminPassword()) {
    return jsonError("configuration_error", "관리자 비밀번호 환경변수가 필요합니다.", 503);
  }

  const parsed = adminLoginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("validation_error", "비밀번호를 입력해 주세요.");
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    return jsonError("invalid_password", "비밀번호가 올바르지 않습니다.", 401);
  }

  await createAdminSession();
  return jsonOk({ authenticated: true });
}

export async function DELETE() {
  await clearAdminSession();
  return jsonOk({ authenticated: false });
}
