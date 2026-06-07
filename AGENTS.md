# Agent Instructions

이 저장소는 모바일 청첩장 앱을 만들기 전의 계획 하네스에서 시작한다. 구현자는 먼저 문서를 읽고, 잠긴 제품 결정을 바꾸지 않는다.

## Required Reading

1. `docs/index.md`
2. `PRODUCT_SENSE.md`
3. `ARCHITECTURE.md`
4. `FRONTEND.md`
5. `DESIGN.md`
6. `SECURITY.md`
7. `RELIABILITY.md`
8. `docs/exec-plans/active/build-mobile-invitation.md`

## Hard Constraints

- 게스트스냅, 사진 업로드형 게스트 기능, 게스트 전용 갤러리는 구현하지 않는다.
- 섹션 위치 인덱스, 햄버거 목차, 플로팅 섹션 바로가기, 페이지 진행도 기반 메뉴는 구현하지 않는다.
- 방문 로그, 전체 인덱싱, 분석 스크립트, 사용자 추적 기능은 구현하지 않는다.
- 화면에 보이는 임베디드 지도는 Naver Maps API만 사용한다.
- Kakao Map 렌더링은 금지한다. KakaoNavi는 외부 길찾기 링크 버튼으로만 허용한다.
- Supabase service role key와 `ADMIN_PASSWORD`는 브라우저에 노출하지 않는다.
- RSVP와 방명록 제출은 실패 시 사용자가 재시도할 수 있어야 하며, 조용히 유실되면 안 된다.
- 검색 노출 방지를 위해 `noindex`와 `noarchive` 메타를 기본 적용한다.

## Implementation Workflow

1. 활성 실행 계획을 확인한다.
2. 변경 범위를 계획에 맞게 제한한다.
3. 데이터 계약, 보안 규칙, 프론트엔드 규칙을 먼저 반영한다.
4. 모바일 화면을 우선 구현하고 데스크톱은 중앙 정렬된 보조 뷰로 처리한다.
5. 빌드, 타입 체크, 핵심 브라우저 검증을 완료한다.
6. 변경 파일, 검증 결과, 남은 리스크를 보고한다.

## Escalate To User

아래 사항은 임의로 결정하지 않는다.

- 실제 예식 정보, 사진, 장소 좌표, 연락처, 계좌 정보가 필요한 경우
- Supabase 프로젝트와 Naver Maps 키가 없는 경우
- 게스트스냅 또는 섹션 목차 같은 제외 기능을 다시 추가하려는 요청이 생긴 경우
- 공개 범위, 개인정보 보관 기간, 관리자 인증 수준을 바꾸는 경우

## Done Criteria

- 필수 문서의 결정과 구현이 충돌하지 않는다.
- 제외 기능이 코드나 UI에 남아 있지 않다.
- RSVP, 방명록, 관리자, Naver 지도, 길찾기 링크가 검증된다.
- 릴리스 차단 기준이 모두 통과한다.
