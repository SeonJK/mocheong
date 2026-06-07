# Security

## Threat Model

개인 청첩장 v1은 공개 페이지와 단일 관리자 화면을 가진 소규모 앱이다. 목표는 개인정보와 서버 키를 보호하고, 공개 방문자가 관리자 데이터에 접근하지 못하게 하는 것이다.

## Secrets

브라우저 노출 허용:

- `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

브라우저 노출 금지:

- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- 관리자 세션 서명 키를 추가하는 경우 해당 키

## Supabase Access

- 공개 브라우저는 Supabase 테이블에 직접 write하지 않는다.
- 모든 RSVP와 방명록 write는 Next.js API route에서 검증 후 수행한다.
- service role key는 서버 전용 파일에서만 읽는다.
- RLS는 활성화하고, 공개 anon key로 민감 테이블을 직접 조회하거나 수정하지 못하게 한다.

## Admin Auth

- `/admin`은 `ADMIN_PASSWORD`로 보호한다.
- 인증 성공 시 HttpOnly, SameSite=Lax 이상, production Secure 쿠키를 사용한다.
- 관리자 API는 세션 쿠키가 없으면 401을 반환한다.
- 회원가입, OAuth, 다중 관리자 권한은 v1 범위 밖이다.

## Privacy

- RSVP에는 필요한 참석 관리 정보만 저장한다.
- 방명록은 이름과 메시지만 저장한다.
- 전화번호는 필요할 때만 선택 필드로 저장한다.
- 계좌 정보는 청첩장 공개 콘텐츠로 취급하되, 서버 로그에 반복 기록하지 않는다.
- API 로그에는 이름, 전화번호, 계좌번호, 방명록 전문을 남기지 않는다.

## Prohibited

- 방문자 분석 스크립트
- 전체 방문 로그
- 사용자 행동 추적
- secret을 URL, 클라이언트 JS 번들, 콘솔 로그에 노출
- 관리자 데이터를 공개 API 응답에 포함

## Dependency Policy

- 필수 패키지 위주로 설치한다.
- 지도, Supabase, 폼 검증, 아이콘 외의 대형 라이브러리는 필요성이 명확할 때만 추가한다.
- 새 패키지는 구현 계획 또는 변경 요약에 이유를 남긴다.
