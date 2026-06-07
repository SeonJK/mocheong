"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowUp,
  Check,
  ChevronDown,
  ExternalLink,
  Leaf,
  MapPin,
  Phone,
  Send,
  Share2,
  X
} from "lucide-react";
import { invitationConfig, formatWeddingDate, weddingDate } from "@/config/invitation";
import { NaverMap } from "@/components/invitation/NaverMap";
import { kakaoNaviUrl, naverMapSearchUrl, tmapUrl } from "@/lib/naver-map";

type SubmitStatus = {
  kind: "idle" | "success" | "error";
  message?: string;
};

type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

type ModalName = "contact" | "rsvp" | "guestbook" | null;

function newRequestId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function getDDay() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const target = new Date(weddingDate.getFullYear(), weddingDate.getMonth(), weddingDate.getDate()).getTime();
  const diff = Math.ceil((target - start) / (1000 * 60 * 60 * 24));
  if (diff > 0) {
    return `D-${diff}`;
  }
  if (diff === 0) {
    return "오늘";
  }
  return "감사합니다";
}

function calendarDays() {
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const cells: Array<number | null> = Array.from({ length: first.getDay() }, () => null);
  for (let day = 1; day <= last.getDate(); day += 1) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

function formatDateShort(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul"
  }).format(new Date(value));
}

function Section({
  title,
  children,
  className = ""
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`section-block ${className}`}>
      {title ? <h2 className="section-title">{title}</h2> : null}
      {children}
    </section>
  );
}

function Modal({
  title,
  children,
  onClose
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="modal-dimmed" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-panel">
        <div className="modal-title">
          <strong>{title}</strong>
          <button className="modal-close" type="button" onClick={onClose} aria-label="닫기">
            <X size={21} aria-hidden />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function RsvpForm() {
  const [side, setSide] = useState<"groom" | "bride">("groom");
  const [attendance, setAttendance] = useState<"attending" | "declined">("attending");
  const [meal, setMeal] = useState<"yes" | "no" | "undecided">("yes");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [companionCount, setCompanionCount] = useState(0);
  const [companionNames, setCompanionNames] = useState("");
  const [memo, setMemo] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus({ kind: "idle" });

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientRequestId: newRequestId(),
          side,
          attendance,
          meal: attendance === "attending" ? meal : undefined,
          name,
          phone,
          companionCount,
          companionNames,
          memo,
          privacyAgreed
        })
      });
      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error?.message ?? "참석 답변 저장에 실패했습니다.");
      }

      setStatus({ kind: "success", message: "참석 답변이 저장되었습니다. 감사합니다." });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "저장에 실패했습니다. 다시 시도해 주세요."
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="rsvp-form" onSubmit={submit}>
      <div className="segmented" aria-label="측 구분">
        <button type="button" className={side === "groom" ? "selected" : ""} onClick={() => setSide("groom")}>
          신랑측
        </button>
        <button type="button" className={side === "bride" ? "selected" : ""} onClick={() => setSide("bride")}>
          신부측
        </button>
      </div>

      <div className="segmented" aria-label="참석 여부">
        <button
          type="button"
          className={attendance === "attending" ? "selected" : ""}
          onClick={() => setAttendance("attending")}
        >
          <Check size={16} aria-hidden />
          참석합니다
        </button>
        <button
          type="button"
          className={attendance === "declined" ? "selected" : ""}
          onClick={() => setAttendance("declined")}
        >
          참석하지 못합니다
        </button>
      </div>

      <div className="form-grid">
        <label>
          <span>이름</span>
          <input className="field" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          <span>휴대폰 번호</span>
          <input className="field" value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" />
        </label>
        <label>
          <span>동행 인원</span>
          <input
            className="field"
            type="number"
            min={0}
            value={companionCount}
            onChange={(event) => setCompanionCount(Number(event.target.value))}
          />
        </label>
        <label>
          <span>식사 여부</span>
          <select
            className="field"
            value={meal}
            onChange={(event) => setMeal(event.target.value as "yes" | "no" | "undecided")}
            disabled={attendance === "declined"}
          >
            <option value="yes">식사합니다</option>
            <option value="no">식사하지 않습니다</option>
            <option value="undecided">미정입니다</option>
          </select>
        </label>
      </div>

      <label>
        <span>동행인 이름</span>
        <input
          className="field"
          value={companionNames}
          onChange={(event) => setCompanionNames(event.target.value)}
          placeholder="선택 입력"
        />
      </label>

      <label>
        <span>전하실 말씀</span>
        <textarea
          className="field"
          rows={3}
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
          placeholder="선택 입력"
        />
      </label>

      <label className="check-row">
        <input
          type="checkbox"
          checked={privacyAgreed}
          onChange={(event) => setPrivacyAgreed(event.target.checked)}
          required
        />
        <span>참석 확인을 위한 개인정보 수집에 동의합니다.</span>
      </label>

      <button className="primary-button full-button" type="submit" disabled={pending}>
        <Send size={17} aria-hidden />
        {pending ? "제출 중" : "참석 답변 제출하기"}
      </button>

      {status.kind !== "idle" ? (
        <p className={`status-text ${status.kind === "success" ? "status-success" : "status-error"}`}>
          {status.message}
        </p>
      ) : null}
      <p className="form-note">정확한 답변 관리를 위해 {invitationConfig.wedding.rsvpDueDate}까지 응답 부탁드립니다.</p>
    </form>
  );
}

function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });

  async function loadEntries() {
    setLoading(true);
    try {
      const response = await fetch("/api/guestbook");
      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error?.message ?? "방명록을 불러오지 못했습니다.");
      }
      setEntries(result.data.entries);
      setStatus({ kind: "idle" });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "방명록을 불러오지 못했습니다."
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEntries();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus({ kind: "idle" });

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientRequestId: newRequestId(),
          name,
          message
        })
      });
      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error?.message ?? "방명록 저장에 실패했습니다.");
      }
      setName("");
      setMessage("");
      setStatus({ kind: "success", message: "축하 메시지가 등록되었습니다." });
      await loadEntries();
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "저장에 실패했습니다. 다시 시도해 주세요."
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="guestbook">
      <form onSubmit={submit}>
        <input
          className="field"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="이름"
          required
        />
        <textarea
          className="field"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="따뜻한 축하 메시지를 남겨주세요."
          maxLength={300}
          rows={3}
          required
        />
        <div className="message-footer">
          <span>{message.length} / 300</span>
          <button className="primary-button" disabled={pending} type="submit">
            등록하기
          </button>
        </div>
      </form>

      {status.kind !== "idle" ? (
        <p className={`status-text ${status.kind === "success" ? "status-success" : "status-error"}`}>
          {status.message}
        </p>
      ) : null}

      <div className="guestbook-list" aria-live="polite">
        {loading ? <p className="soft-copy">방명록을 불러오는 중입니다.</p> : null}
        {!loading && entries.length === 0 && status.kind !== "error" ? (
          <p className="soft-copy">아직 남겨진 메시지가 없습니다.</p>
        ) : null}
        {entries.map((entry) => (
          <article className="guestbook-entry" key={entry.id}>
            <Leaf size={16} aria-hidden />
            <strong>{entry.name}</strong>
            <p>{entry.message}</p>
            <time>{formatDateShort(entry.created_at)}</time>
          </article>
        ))}
      </div>
    </div>
  );
}

export function InvitationPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const [expandedAccount, setExpandedAccount] = useState<"groom" | "bride" | null>(null);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const days = useMemo(calendarDays, []);
  const weddingDay = weddingDate.getDate();
  const month = weddingDate.getMonth() + 1;
  const monthLabel = `${month}월의`;
  const dayLabel = `${weddingDate.getDate()}번째 날.`;
  const gallerySlots = Array.from({ length: Math.max(9, invitationConfig.images.gallery.length) }, (_, index) => ({
    image: invitationConfig.images.gallery[index % invitationConfig.images.gallery.length],
    sourceIndex: index % invitationConfig.images.gallery.length
  }));
  const galleryImages = showAllGallery ? gallerySlots : gallerySlots.slice(0, 9);

  async function copyAccount(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied("복사 실패");
    }
  }

  async function shareInvitation() {
    const shareData = {
      title: document.title,
      text: `${invitationConfig.couple.groom.name}와 ${invitationConfig.couple.bride.name}의 결혼식에 초대합니다.`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("청첩장 주소를 복사했습니다.");
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("청첩장 주소를 복사했습니다.");
      } catch {
        setShareStatus("공유에 실패했습니다. 다시 시도해 주세요.");
      }
    } finally {
      window.setTimeout(() => setShareStatus(null), 1800);
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="app-shell">
      <article className="phone-page">
        <section className="hero-section">
          <Image
            src={invitationConfig.images.cover}
            alt={`${invitationConfig.couple.groom.name}와 ${invitationConfig.couple.bride.name} 커버 사진`}
            fill
            priority
            sizes="430px"
            className="hero-image"
          />
          <div className="hero-content">
            <h1>
              {invitationConfig.couple.groom.name}
              <span aria-hidden> · </span>
              {invitationConfig.couple.bride.name}
            </h1>
          </div>
          <div className="main-bottom">
            <p>{formatWeddingDate()}</p>
            <p>
              {invitationConfig.wedding.venueName} {invitationConfig.wedding.hall}
            </p>
          </div>
          <span className="scroll-cue">스크롤</span>
        </section>

        <Section className="quote-section">
          <p>“{invitationConfig.copy.quote}”</p>
        </Section>

        <Section title="소중한 분들을 초대합니다." className="greeting-section">
          <div className="greeting-copy">
            {invitationConfig.copy.greeting.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Section>

        <Section className="couple-section">
          <div className="couple-column">
            {[
              ["신랑", invitationConfig.couple.groom, "의 자녀"],
              ["신부", invitationConfig.couple.bride, "의 자녀"]
            ].map(([label, person, suffix]) => (
              <div className="couple-line" key={label as string}>
                <div className="couple-name">
                  <span>{label as string}</span>
                  <strong>{(person as typeof invitationConfig.couple.groom).name}</strong>
                  <a href={`tel:${(person as typeof invitationConfig.couple.groom).phone}`} aria-label={`${label}에게 전화`}>
                    <Phone size={15} aria-hidden />
                  </a>
                </div>
                <p>
                  {(person as typeof invitationConfig.couple.groom).parents.join(" · ")}
                  {suffix as string}
                </p>
              </div>
            ))}
          </div>
          <button className="outline-action" type="button" onClick={() => setActiveModal("contact")}>
            혼주에게 연락하기
          </button>
        </Section>

        <Section className="calendar-section">
          <div className="calendar-head">
            <span>{monthLabel}</span>
            <strong>{dayLabel}</strong>
          </div>
          <div className="calendar-grid" aria-label={`${monthLabel} 달력`}>
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <span className="weekday" key={day}>
                {day}
              </span>
            ))}
            {days.map((day, index) => (
              <span className={day === weddingDay ? "wedding-day" : ""} key={`${day ?? "empty"}-${index}`}>
                {day}
              </span>
            ))}
          </div>
          <div className="d-day">
            <p>
              {invitationConfig.couple.groom.name} {invitationConfig.couple.bride.name} 결혼식까지
            </p>
            <strong>{getDDay()}</strong>
          </div>
        </Section>

        <Section title="갤러리" className="gallery-section">
          <div className="gallery-grid">
            {galleryImages.map(({ image, sourceIndex }, index) => (
              <button
                type="button"
                className="gallery-item"
                key={`${image}-${index}`}
                onClick={() => setSelectedImage(sourceIndex)}
              >
                <Image src={image} alt={`웨딩 갤러리 ${index + 1}`} fill sizes="140px" />
              </button>
            ))}
          </div>
          {gallerySlots.length > 9 ? (
            <button className="more-button" type="button" onClick={() => setShowAllGallery((value) => !value)}>
              {showAllGallery ? "접기" : "더 보기"}
              <ChevronDown size={15} aria-hidden />
            </button>
          ) : null}
        </Section>

        <Section title="참석 여부 전달" className="cta-section">
          <p className="section-copy">
            결혼식에 참석해주시는 모든 분들을
            <br />
            더욱 특별하게 모시고자 하오니,
            <br />
            참석 여부 전달을 부탁드립니다.
          </p>
          <button className="outline-action" type="button" onClick={() => setActiveModal("rsvp")}>
            참석 여부 전달
          </button>
        </Section>

        <Section className="wreath-section">
          <strong>화환은 정중히 사양합니다.</strong>
          <p>
            축하의 마음만 감사히 받겠습니다.
            <br />
            너른 양해 부탁드립니다.
          </p>
        </Section>

        <Section title="마음 전하실 곳" className="account-section">
          <p className="section-copy">
            멀리서도 축하의 마음을
            <br />
            전하고 싶으신 분들을 위해
            <br />
            계좌번호를 안내드립니다.
          </p>
          <div className="account-list">
            {(["groom", "bride"] as const).map((side) => {
              const accounts = invitationConfig.accounts.filter((account) => account.side === side);
              const label = side === "groom" ? "신랑측" : "신부측";
              return (
                <div className="account-group" key={side}>
                  <button
                    className="account-toggle"
                    type="button"
                    onClick={() => setExpandedAccount((current) => (current === side ? null : side))}
                    aria-expanded={expandedAccount === side}
                  >
                    {label}
                    <ChevronDown size={16} aria-hidden />
                  </button>
                  {expandedAccount === side ? (
                    <div className="account-panel">
                      {accounts.map((account) => (
                        <div className="account-row" key={`${account.label}-${account.number}`}>
                          <div>
                            <span>{account.label}</span>
                            <p>{account.number}</p>
                            <em>
                              {account.bank} {account.holder}
                            </em>
                          </div>
                          <button
                            className="small-action"
                            type="button"
                            onClick={() => copyAccount(`${account.bank} ${account.number} ${account.holder}`, account.label)}
                          >
                            복사
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          {copied ? <p className="status-text status-success">{copied} 계좌를 복사했습니다.</p> : null}
        </Section>

        <Section title="방명록" className="guestbook-section">
          <p className="section-copy">
            아직 작성된 방명록이 없습니다.
            <br />첫 방명록을 작성해주세요.
          </p>
          <div className="guestbook-actions">
            <button className="small-action" type="button" onClick={() => setActiveModal("guestbook")}>
              전체보기
            </button>
            <button className="small-action" type="button" onClick={() => setActiveModal("guestbook")}>
              작성
            </button>
          </div>
        </Section>

        <Section title="오시는 길" className="map-section">
          <div className="venue-info">
            <strong>{invitationConfig.wedding.venueName}</strong>
            <p>{invitationConfig.wedding.hall}</p>
            <p>{invitationConfig.wedding.address}</p>
          </div>
          <div className="map-layout">
            <NaverMap />
          </div>
          <div className="direction-buttons">
            <a className="secondary-button" href={naverMapSearchUrl()} target="_blank" rel="noreferrer">
              <MapPin size={17} aria-hidden />
              네이버지도
            </a>
            <a className="secondary-button" href={kakaoNaviUrl()} target="_blank" rel="noreferrer">
              길찾기
              <ExternalLink size={16} aria-hidden />
            </a>
            <a className="secondary-button" href={tmapUrl()} target="_blank" rel="noreferrer">
              T맵
              <ExternalLink size={16} aria-hidden />
            </a>
          </div>
        </Section>

        <Section title="안내사항" className="notice-section">
          <ul className="notice-list">
            {invitationConfig.notices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </Section>

        <Section title="주차 안내" className="parking-section">
          {invitationConfig.transport.parking.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </Section>

        <footer className="closing-section">
          {invitationConfig.copy.closing.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <strong>
            {invitationConfig.couple.groom.name} & {invitationConfig.couple.bride.name}
          </strong>
        </footer>

        <div className="floating-actions" aria-label="공유와 맨 위로 이동">
          <button type="button" onClick={shareInvitation} aria-label="공유하기">
            <Share2 size={18} aria-hidden />
          </button>
          <button type="button" onClick={scrollToTop} aria-label="맨 위로 이동">
            <ArrowUp size={18} aria-hidden />
          </button>
        </div>
        {shareStatus ? <p className="floating-status">{shareStatus}</p> : null}

        {activeModal === "contact" ? (
          <Modal title="혼주에게 연락하기" onClose={() => setActiveModal(null)}>
            <div className="contact-list">
              {[
                ["신랑", invitationConfig.couple.groom],
                ["신부", invitationConfig.couple.bride]
              ].map(([label, person]) => (
                <a
                  className="contact-row"
                  href={`tel:${(person as typeof invitationConfig.couple.groom).phone}`}
                  key={label as string}
                >
                  <span>{label as string}</span>
                  <strong>{(person as typeof invitationConfig.couple.groom).name}</strong>
                  <Phone size={16} aria-hidden />
                </a>
              ))}
            </div>
          </Modal>
        ) : null}

        {activeModal === "rsvp" ? (
          <Modal title="참석 여부 전달" onClose={() => setActiveModal(null)}>
            <RsvpForm />
          </Modal>
        ) : null}

        {activeModal === "guestbook" ? (
          <Modal title="방명록" onClose={() => setActiveModal(null)}>
            <Guestbook />
          </Modal>
        ) : null}

        {selectedImage !== null ? (
          <div className="gallery-modal" role="dialog" aria-modal="true" aria-label="갤러리 이미지">
            <button className="modal-close" type="button" onClick={() => setSelectedImage(null)} aria-label="닫기">
              <X size={22} aria-hidden />
            </button>
            <Image
              src={invitationConfig.images.gallery[selectedImage]}
              alt={`웨딩 갤러리 확대 ${selectedImage + 1}`}
              fill
              sizes="100vw"
            />
          </div>
        ) : null}
      </article>
    </main>
  );
}
