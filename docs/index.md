# Documentation Index

## Reading Order

1. `AGENTS.md`
2. `PRODUCT_SENSE.md`
3. `ARCHITECTURE.md`
4. `docs/generated/data-contracts.md`
5. `FRONTEND.md`
6. `DESIGN.md`
7. `SECURITY.md`
8. `RELIABILITY.md`
9. `QUALITY_SCORE.md`
10. `docs/exec-plans/active/build-mobile-invitation.md`

## Product Specs

- `docs/product-specs/mobile-invitation.md`: 공개 모바일 청첩장 흐름
- `docs/product-specs/admin.md`: 관리자 흐름

## Execution Plans

- active: `docs/exec-plans/active/build-mobile-invitation.md`
- completed: 아직 없음
- tech debt: `docs/exec-plans/tech-debt-tracker.md`

## References

- `docs/references/source-site-analysis.md`: 참고 사이트에서 유지/제거할 기능 정리
- `docs/design-docs/visual-direction.md`: 시각 방향 요약
- `docs/sub-agents/README.md`: 서브 에이전트 역할과 루프

## Locked Decisions

- 모바일 우선 단일 청첩장 앱이다.
- 게스트스냅은 구현하지 않는다.
- 섹션 목차, 위치 인덱스, 햄버거 바로가기 메뉴는 구현하지 않는다.
- 화면에 보이는 지도는 Naver Maps로만 구현한다.
- 방문 분석과 전체 방문 로그는 구현하지 않는다.
- RSVP와 방명록은 Supabase Postgres에 저장한다.
- `/admin`은 단일 관리자 비밀번호로 보호한다.
- 공유 OG 메타는 유지하고 검색 노출 방지 메타는 적용한다.

## Open Decisions

- 실제 예식 정보, 사진, 좌표, 연락처, 계좌 정보
- Supabase 프로젝트와 Naver Maps key id
- KakaoNavi/T-map 외부 링크 버튼을 v1에 함께 노출할지 여부
- 개인정보 보관 기간

## Current Status

하네스 문서 작성 단계다. 앱 구현은 active plan에 따라 별도 단계에서 시작한다.
