# Build Mobile Invitation

## Objective

`Next.js App Router + TypeScript + Supabase + Naver Maps`로 모바일 청첩장 v1을 구현한다.

## Non-Goals

- 게스트스냅
- 섹션 목차, 위치 인덱스, 햄버거 바로가기
- 방문 분석과 전체 접근 로그
- 회원가입형 관리자 인증
- 복수 템플릿 CMS

## Likely Subsystems

- Next.js app scaffold
- `invitationConfig`
- 공개 청첩장 섹션 컴포넌트
- RSVP API and form
- Guestbook API and UI
- Admin auth and admin dashboard
- Naver Maps component
- Supabase schema and server client

## Implementation Sequence

1. Next.js App Router 프로젝트를 TypeScript, Tailwind CSS, ESLint로 만든다.
2. `invitationConfig`를 만들고 임시 콘텐츠를 채운다.
3. metadata에 OG 태그와 `noindex/noarchive`를 적용한다.
4. 공개 섹션을 모바일 우선으로 구현한다.
5. Naver Maps 컴포넌트와 실패 대체 UI를 구현한다.
6. Supabase schema를 만들고 `rsvps`, `guestbook_entries` 테이블을 준비한다.
7. RSVP API와 폼을 구현한다.
8. 방명록 API와 UI를 구현한다.
9. 관리자 로그인, RSVP 목록, CSV, 방명록 관리 화면을 구현한다.
10. 제외 기능이 없는지 점검하고 품질 게이트를 실행한다.

## Packages

- required: `@supabase/supabase-js`, `zod`, `lucide-react`
- styling: Tailwind CSS
- avoid by default: heavy carousel/template libraries, analytics packages, map SDKs other than Naver Maps

## Environment Variables

- `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

## Data And API

- 데이터 계약은 `docs/generated/data-contracts.md`를 따른다.
- public API는 RSVP 저장, 방명록 조회, 방명록 저장만 제공한다.
- admin API는 인증된 세션에서만 RSVP와 방명록 관리 데이터를 제공한다.

## Edge Cases

- Naver Maps key 누락 또는 스크립트 실패
- Supabase 연결 실패
- RSVP 중복 submit
- 방명록 submit 후 네트워크 실패
- 관리자 세션 만료
- 모바일에서 긴 이름, 긴 장소명, 긴 방명록 메시지

## Verification

- `npm run build`
- TypeScript check
- 모바일 360px, 390px, 430px 시각 검증
- 데스크톱 중앙 칼럼 검증
- RSVP validation, success, retry
- guestbook list, create, failure state
- admin login, RSVP list, CSV, guestbook hide/delete
- Naver Maps render and fallback
- grep or DOM inspection으로 guest snap과 section index UI 부재 확인

## Completion Criteria

- `QUALITY_SCORE.md` release gate를 통과한다.
- active plan 결과를 completed plan으로 이동할 수 있을 만큼 검증 기록이 남는다.
- 사용자에게 필요한 실제 config 값 목록이 명확히 보고된다.
