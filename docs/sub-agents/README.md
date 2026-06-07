# Sub-Agent Workflow

## Loop

```text
architect -> implementer -> reviewer/tester -> architect -> implementer
```

## Roles

- `architect.md`: 시스템 적합성과 repair triage
- `implementer.md`: 활성 계획 구현
- `reviewer.md`: 코드 리뷰와 리스크 탐지
- `tester.md`: 수용 기준 검증

## Blocking Findings

- secret 노출
- 개인정보 유실 또는 잘못된 공개
- RSVP/방명록 조용한 저장 실패
- 게스트스냅 또는 섹션 인덱스 구현
- Naver Maps가 아닌 임베디드 지도
- 관리자 인증 우회
- active plan 수용 기준 실패
