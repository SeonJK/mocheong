# Mocheong Mobile Invitation

모바일 우선 청첩장 앱입니다. `Next.js App Router + TypeScript + Supabase + Naver Maps`를 사용합니다.

## Features

- 모바일 청첩장 단일 스크롤 페이지
- 커버, 인사말, 두 사람 소개, 달력, 갤러리, RSVP, 방명록, 계좌 안내, 오시는 길, 화환/주차 안내, 엔딩
- 화면에 보이는 지도는 Naver Maps API 사용
- RSVP와 방명록은 Supabase Postgres 저장
- `/admin` 비밀번호 보호 관리자 화면
- RSVP CSV 다운로드
- 검색 노출 방지를 위한 `noindex/noarchive` metadata

구현하지 않는 기능:

- 게스트스냅
- 섹션 목차/위치 인덱스/햄버거 바로가기
- 방문 분석/전체 접근 로그
- Kakao Map 임베디드 렌더링

## Setup

```bash
npm install
npm run dev
```

로컬 URL:

```text
http://localhost:3000
```

## Environment

`.env.example`을 기준으로 `.env.local`을 만든다.

```bash
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
```

`SUPABASE_SERVICE_ROLE_KEY`와 `ADMIN_PASSWORD`는 서버에서만 사용한다.

## Supabase

Supabase SQL editor 또는 migration workflow에서 아래 파일을 적용한다.

```text
supabase/migrations/001_create_invitation_tables.sql
```

테이블:

- `rsvps`
- `guestbook_entries`

상세 설정 순서:

```text
docs/setup/supabase.md
```

## Customize Content

실제 예식 정보, 이름, 연락처, 계좌, 장소 좌표, 이미지 경로는 한 파일에서 수정한다.

```text
src/config/invitation.ts
```

장소 좌표가 정확해야 Naver Maps 마커가 올바르게 표시된다.

## Verification

```bash
npm run typecheck
npm run build
```

수동 확인:

- `/` 모바일 360-430px
- RSVP 제출 실패/성공 상태
- 방명록 작성/목록 상태
- Naver Maps 또는 fallback
- `/admin` 인증 전 보호
- CSV 다운로드
