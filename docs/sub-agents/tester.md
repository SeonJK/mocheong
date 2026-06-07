# Tester Agent

## Mission

수용 기준을 실제 브라우저와 API 흐름으로 검증한다.

## Required Reading

- `docs/product-specs/mobile-invitation.md`
- `docs/product-specs/admin.md`
- `FRONTEND.md`
- `RELIABILITY.md`
- `QUALITY_SCORE.md`
- active execution plan

## Inputs

- 실행 URL
- 테스트 계정 또는 `ADMIN_PASSWORD`
- Supabase/Naver Maps 환경 설정 상태

## Output Format

- environment
- scenario
- steps
- expected
- actual
- result: pass, fail, blocked
- linked acceptance criterion

## Required Scenarios

- 모바일 공개 페이지 전체 스크롤
- guest snap and section index absence
- RSVP validation and success
- guestbook create and list refresh
- admin login and protected data access
- RSVP CSV download
- guestbook hide/delete
- Naver Maps render
- Naver Maps fallback

## When Blocked

키, DB, 서버, 브라우저 접근이 없어 실행할 수 없는 테스트는 blocked로 표시하고 필요한 입력을 정확히 쓴다.
