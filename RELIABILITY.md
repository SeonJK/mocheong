# Reliability

## Principles

- RSVP와 방명록은 조용히 유실되면 안 된다.
- 사용자가 제출 결과를 알 수 있어야 한다.
- 네트워크 실패 후 같은 요청 재시도가 중복 기록을 만들지 않아야 한다.
- 외부 지도 API가 실패해도 장소 정보는 계속 접근 가능해야 한다.

## Idempotency

- RSVP와 방명록 쓰기 요청은 `clientRequestId` UUID를 포함한다.
- 서버는 `clientRequestId`에 unique constraint를 둔다.
- 같은 `clientRequestId`가 다시 들어오면 중복 insert 대신 성공으로 처리한다.
- 새 제출을 의도한 경우 클라이언트는 새 `clientRequestId`를 생성한다.

## Failure Handling

- RSVP 저장 실패: 폼 값은 유지하고 실패 메시지와 재시도 버튼을 보여준다.
- 방명록 저장 실패: 입력값을 유지하고 재시도를 허용한다.
- 방명록 조회 실패: 빈 목록처럼 보이지 않게 오류 상태를 표시한다.
- 관리자 CSV 실패: 다운로드 실패 메시지를 표시하고 목록 화면은 유지한다.
- Naver Maps 실패: 장소명, 주소, 네이버지도 외부 링크를 대체 표시한다.

## Duplicate Prevention

- 제출 버튼은 pending 상태에서 disabled 처리한다.
- API는 `clientRequestId` unique constraint로 중복 최종 기록을 막는다.
- 이름과 내용이 같다는 이유만으로 중복을 막지 않는다.

## Data Recovery

- 방명록 관리자 삭제는 v1에서 soft delete로 처리한다.
- 숨김 처리된 방명록은 공개 목록에서 제외하지만 관리자 화면에는 표시한다.
- RSVP hard delete 기능은 v1에 만들지 않는다.

## Observability

- 개인정보를 포함하지 않는 서버 오류만 로깅한다.
- 방문자 분석과 전체 접근 로그는 만들지 않는다.
- 릴리스 전 수동 검증 결과를 완료된 실행 계획에 남긴다.
