# Plans

## Plan Lifecycle

- 새 구현 작업은 `docs/exec-plans/active/`에 작성한다.
- 완료된 계획은 `docs/exec-plans/completed/`로 이동하고 결과와 검증을 남긴다.
- 미루는 작업은 `docs/exec-plans/tech-debt-tracker.md`에 기록한다.

## Plan Requirements

각 실행 계획은 아래 내용을 포함해야 한다.

- objective
- explicit non-goals
- likely files or subsystems
- implementation sequence
- data/schema/API changes
- edge cases and failure modes
- verification steps
- completion criteria

## Review Rules

- 구현 전 architect가 계획과 문서 충돌을 확인한다.
- 구현 후 reviewer와 tester가 품질 게이트를 확인한다.
- 실패가 있으면 architect가 blocking, must-fix, follow-up, question, invalid 중 하나로 분류한다.
- blocking과 must-fix는 완료 처리 전에 고친다.

## Change Control

아래 결정은 사용자 승인 없이 바꾸지 않는다.

- 게스트스냅 제외
- 섹션 인덱스/목차 제외
- Naver Maps를 화면 지도 렌더링 SDK로 사용
- Supabase Postgres 저장소 사용
- 단일 관리자 비밀번호 인증으로 시작
- noindex/noarchive 기본 적용
