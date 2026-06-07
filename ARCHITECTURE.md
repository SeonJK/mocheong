# Architecture

## System Shape

v1은 `Next.js App Router + TypeScript` 앱으로 구현한다. 배포 기본값은 Vercel이며, 데이터 저장은 Supabase Postgres를 사용한다.

```text
mobile browser
  -> Next.js app shell and server-rendered metadata
  -> public API routes for RSVP and guestbook
  -> protected admin routes
  -> Supabase Postgres
  -> Naver Maps JS API for visible map rendering
```

## Runtime Boundaries

- 공개 청첩장 페이지: 초대장 콘텐츠, 갤러리, RSVP 폼, 방명록 목록/작성, Naver 지도, 외부 길찾기 링크를 제공한다.
- API routes: 입력 검증, Supabase 저장, 공개 방명록 조회를 담당한다.
- 관리자 화면: 단일 비밀번호 인증 후 RSVP와 방명록을 관리한다.
- Supabase: RSVP와 방명록의 유일한 영구 저장소다.
- Naver Maps: 화면에 보이는 지도와 마커를 렌더링하는 유일한 지도 렌더링 SDK다.

## Expected Project Layout

```text
src/
├── app/
│   ├── page.tsx
│   ├── admin/
│   └── api/
├── components/
│   ├── invitation/
│   └── admin/
├── config/
│   └── invitation.ts
├── lib/
│   ├── supabase.ts
│   ├── validation.ts
│   └── naver-map.ts
└── styles/
```

Tailwind CSS를 기본 스타일링 도구로 사용한다. 아이콘이 필요하면 `lucide-react`를 사용한다.

## Content Source

`invitationConfig`를 단일 콘텐츠 소스로 둔다. 실제 값이 없으면 구현 중 임시값을 쓰되, 필드 구조는 유지한다.

```ts
type InvitationConfig = {
  couple: {
    groom: { name: string; phone?: string; parents?: string[] };
    bride: { name: string; phone?: string; parents?: string[] };
  };
  wedding: {
    dateTime: string;
    venueName: string;
    address: string;
    lat: number;
    lng: number;
  };
  copy: {
    heroTitle: string;
    greeting: string;
    quote?: string;
    closing: string;
  };
  images: {
    og: string;
    cover: string;
    gallery: string[];
  };
  accounts: Array<{
    side: "groom" | "bride";
    label: string;
    bank: string;
    number: string;
    holder: string;
  }>;
  notices: string[];
};
```

## Public API

- `POST /api/rsvp`: RSVP를 저장한다.
- `GET /api/guestbook`: 공개 상태인 방명록을 최신순으로 조회한다.
- `POST /api/guestbook`: 방명록을 저장한다.

모든 쓰기 요청은 `clientRequestId`를 받는다. 같은 `clientRequestId`가 재전송되면 중복 저장하지 않고 기존 성공 응답과 같은 의미로 처리한다.

## Admin API

- `POST /api/admin/session`: `ADMIN_PASSWORD` 검증 후 HttpOnly 세션 쿠키를 설정한다.
- `GET /api/admin/rsvps`: RSVP 목록을 조회한다.
- `GET /api/admin/rsvps.csv`: RSVP CSV를 다운로드한다.
- `GET /api/admin/guestbook`: 방명록 전체 목록을 조회한다.
- `PATCH /api/admin/guestbook/:id`: 방명록 숨김 또는 삭제 상태를 변경한다.

관리자 API는 server role key를 서버에서만 사용한다.

## Supabase Tables

정확한 SQL은 `docs/generated/data-contracts.md`를 따른다.

- `rsvps`: 참석 여부, 식사 여부, 측 구분, 이름, 연락처, 동행인, 메모, 개인정보 동의 시각을 저장한다.
- `guestbook_entries`: 이름, 메시지, 공개 여부, 삭제 여부, 생성일을 저장한다.

## Naver Maps Integration

- 환경변수 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`는 Naver Maps JS API의 공개 key id로 사용한다.
- 구현 시 Maps JS API가 요구하는 쿼리 파라미터 이름을 공식 문서 기준으로 확인하고, 현재 기본값은 `ncpKeyId`로 둔다.
- 지도는 `invitationConfig.wedding.lat/lng` 좌표로 렌더링한다.
- 좌표가 없으면 구현을 멈추고 사용자에게 좌표를 요청한다.
- 스크립트 로드 실패 시 지도 영역에는 주소, 장소명, 네이버지도 외부 링크를 표시한다.

## Metadata And Indexing

- OG title, description, image는 공유용으로 유지한다.
- 검색 노출 방지를 위해 `robots: noindex, noarchive`를 기본 적용한다.
- 여기서 금지하는 섹션 인덱스는 SEO가 아니라 UI 목차/위치 이동 기능을 뜻한다.

## Deployment Defaults

- local: `npm run dev`
- build: `npm run build`
- production: Vercel
- required env: `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`
