# Quality Score

## Release Gate

릴리스하려면 자동 차단 항목이 0개이고, 총점 85점 이상이어야 한다.

## Automatic Blockers

- 게스트스냅 UI 또는 API가 존재한다.
- 섹션 목차, 위치 인덱스, 햄버거 바로가기 메뉴가 존재한다.
- 화면에 보이는 지도가 Naver Maps가 아니다.
- Supabase service role key 또는 `ADMIN_PASSWORD`가 브라우저 번들에 노출된다.
- RSVP 또는 방명록 제출이 실패했는데 사용자가 알 수 없다.
- 관리자 인증 없이 RSVP 또는 전체 방명록 관리 데이터에 접근 가능하다.
- `npm run build`가 실패한다.

## Scoring

- Product fit: 20점. 필수 섹션과 제외 기능 결정이 정확히 반영된다.
- Mobile UX: 20점. 360px-430px 모바일에서 읽기, 제출, 길찾기가 편하다.
- Data and API: 20점. 검증, 저장, 중복 방지, 관리자 조회가 안정적이다.
- Security and privacy: 15점. secret, 개인정보, 관리자 경계가 안전하다.
- Reliability: 15점. 실패/재시도/지도 대체 상태가 명확하다.
- Visual quality: 10점. 사진, 타이포, 여백, 폼 상태가 전문적으로 보인다.

## Required Verification

- TypeScript check
- Production build
- 모바일 브라우저 시각 검증
- RSVP happy path와 validation failure
- 방명록 happy path와 조회 실패 상태
- 관리자 로그인, 목록, 숨김/삭제, CSV
- Naver Maps 로드와 실패 대체 UI
