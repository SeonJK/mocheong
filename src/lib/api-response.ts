import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, init);
}

export function jsonError(code: string, message: string, status = 400) {
  return NextResponse.json<ApiError>({ ok: false, error: { code, message } }, { status });
}

export function configurationError() {
  return jsonError(
    "configuration_error",
    "서버 저장소 설정이 필요합니다. 환경변수를 확인해 주세요.",
    503
  );
}
