# Data Contracts

이 문서는 구현 기준 계약이다. 실제 migration 파일을 만들 때 이 계약을 반영한다.

## RSVP Payload

```ts
type RsvpPayload = {
  clientRequestId: string;
  side: "groom" | "bride";
  attendance: "attending" | "declined";
  meal?: "yes" | "no" | "undecided";
  name: string;
  phone?: string;
  companionCount?: number;
  companionNames?: string;
  memo?: string;
  privacyAgreed: true;
};
```

## Guestbook Payload

```ts
type GuestbookPayload = {
  clientRequestId: string;
  name: string;
  message: string;
};
```

## RSVP Table

```sql
create extension if not exists pgcrypto;

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  client_request_id uuid not null unique,
  side text not null check (side in ('groom', 'bride')),
  attendance text not null check (attendance in ('attending', 'declined')),
  meal text check (meal in ('yes', 'no', 'undecided')),
  name text not null,
  phone text,
  companion_count integer not null default 0 check (companion_count >= 0),
  companion_names text,
  memo text,
  privacy_agreed_at timestamptz not null,
  created_at timestamptz not null default now()
);
```

## Guestbook Table

```sql
create table public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  client_request_id uuid not null unique,
  name text not null,
  message text not null,
  is_visible boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);
```

## API Response Shape

```ts
type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};
```

## Validation Rules

- `clientRequestId`는 UUID여야 한다.
- `name`은 trim 후 1자 이상이어야 한다.
- 방명록 `message`는 trim 후 1자 이상이어야 한다.
- `companionCount`는 0 이상의 정수여야 한다.
- RSVP에서 `attendance`가 `attending`이면 `meal` 값을 받는다.
- API 오류 메시지는 개인정보를 포함하지 않는다.
