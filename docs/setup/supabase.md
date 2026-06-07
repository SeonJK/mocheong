# Supabase Setup

이 문서는 RSVP, 방명록, 관리자 API를 실제 Supabase 프로젝트에 연결하는 순서다.

## 1. Project Keys

Supabase 대시보드에서 아래 값을 준비한다.

- Project URL
- anon public key
- service role key

`service role key`는 서버 전용이다. 브라우저, 공개 저장소, 클라이언트 번들에 넣지 않는다.

## 2. Local Env

프로젝트 루트에 `.env.local`을 만들고 값을 채운다.

```bash
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=네이버_지도_CLIENT_ID
NEXT_PUBLIC_SUPABASE_URL=https://프로젝트.ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUPABASE_ANON_PUBLIC_KEY
SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD=관리자_비밀번호
```

`.env.local`은 `.gitignore`에 포함되어 있어야 한다. 값을 넣은 뒤에는 `npm run dev`를 재시작한다.

## 3. Database Migration

Supabase SQL Editor에서 아래 파일 내용을 실행한다.

```text
supabase/migrations/001_create_invitation_tables.sql
```

생성되는 테이블은 다음 두 개다.

- `public.rsvps`
- `public.guestbook_entries`

RLS는 켜져 있고 공개 정책은 만들지 않는다. 공개 브라우저는 Supabase에 직접 쓰지 않고, Next.js API가 service role key로 검증 후 저장한다.

## 4. API Smoke Test

환경변수를 넣고 개발 서버를 재시작한 뒤 확인한다.

```bash
npm run dev
```

확인할 흐름:

- `/api/rsvp`에 RSVP 저장
- `/api/guestbook`에 방명록 저장 및 공개 목록 조회
- `/admin` 로그인
- `/api/admin/rsvps` 목록 조회
- `/api/admin/rsvps.csv` CSV 다운로드
- `/api/admin/guestbook/:id` 숨김, 공개, 삭제

Supabase 키가 빠져 있으면 API는 `configuration_error`와 503을 반환해야 한다.

## 5. Release Check

릴리스 전 필수 확인:

- `SUPABASE_SERVICE_ROLE_KEY`와 `ADMIN_PASSWORD`가 `.next/static`에 포함되지 않는다.
- 관리자 API는 로그인 전 401을 반환한다.
- RSVP 중복 제출은 `client_request_id` unique 제약으로 중복 저장되지 않는다.
- 방명록 삭제는 hard delete가 아니라 `deleted_at`을 채우는 soft delete로 처리된다.
