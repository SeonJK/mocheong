"use client";

import { FormEvent, useEffect, useState } from "react";
import { Download, Eye, EyeOff, Lock, LogOut, Trash2 } from "lucide-react";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string } };

type RsvpRow = {
  id: string;
  side: "groom" | "bride";
  attendance: "attending" | "declined";
  meal: "yes" | "no" | "undecided" | null;
  name: string;
  phone: string | null;
  companion_count: number;
  companion_names: string | null;
  memo: string | null;
  created_at: string;
};

type GuestbookRow = {
  id: string;
  name: string;
  message: string;
  is_visible: boolean;
  deleted_at: string | null;
  created_at: string;
};

async function readJson<T>(response: Response) {
  return (await response.json()) as ApiResult<T>;
}

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [entries, setEntries] = useState<GuestbookRow[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session");
        const result = await readJson<{ configured: boolean; authenticated: boolean }>(response);
        if (cancelled || !result.ok) {
          return;
        }
        if (!result.data.configured) {
          setError("관리자 비밀번호 환경변수가 필요합니다.");
          return;
        }
        if (result.data.authenticated) {
          setAuthed(true);
          await loadAdminData();
        }
      } catch {
        if (!cancelled) {
          setError("관리자 세션을 확인하지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadAdminData() {
    setLoading(true);
    setError(null);
    try {
      const [rsvpResponse, guestbookResponse] = await Promise.all([
        fetch("/api/admin/rsvps"),
        fetch("/api/admin/guestbook")
      ]);
      const [rsvpResult, guestbookResult] = await Promise.all([
        readJson<{ rsvps: RsvpRow[] }>(rsvpResponse),
        readJson<{ entries: GuestbookRow[] }>(guestbookResponse)
      ]);

      if (!rsvpResult.ok) {
        throw new Error(rsvpResult.error.message);
      }
      if (!guestbookResult.ok) {
        throw new Error(guestbookResult.error.message);
      }

      setRsvps(rsvpResult.data.rsvps);
      setEntries(guestbookResult.data.entries);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "관리자 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const result = await readJson<{ authenticated: boolean }>(response);
      if (!result.ok) {
        throw new Error(result.error.message);
      }
      setAuthed(true);
      await loadAdminData();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setError(null);
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      setAuthed(false);
      setPassword("");
      setRsvps([]);
      setEntries([]);
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "로그아웃하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function updateGuestbook(id: string, action: "hide" | "show" | "delete") {
    if (action === "hide" && !window.confirm("이 방명록을 숨김 상태로 변경할까요?")) {
      return;
    }
    if (action === "delete" && !window.confirm("이 방명록을 삭제 상태로 변경할까요?")) {
      return;
    }

    const response = await fetch(`/api/admin/guestbook/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    const result = await readJson<{ updated: boolean }>(response);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    await loadAdminData();
  }

  async function downloadCsv() {
    setError(null);
    try {
      const response = await fetch("/api/admin/rsvps.csv");
      if (!response.ok) {
        const result = await readJson<never>(response);
        throw new Error(result.ok ? "CSV를 다운로드하지 못했습니다." : result.error.message);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "rsvps.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (csvError) {
      setError(csvError instanceof Error ? csvError.message : "CSV를 다운로드하지 못했습니다.");
    }
  }

  if (!authed) {
    return (
      <main className="admin-shell">
        <form className="admin-login" onSubmit={submit}>
          <Lock size={28} aria-hidden />
          <h1>청첩장 관리자</h1>
          <p>RSVP와 방명록 관리를 위해 비밀번호를 입력하세요.</p>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="관리자 비밀번호"
            required
          />
          <button className="primary-button full-button" disabled={loading || checkingSession} type="submit">
            {loading || checkingSession ? "확인 중" : "로그인"}
          </button>
          {error ? <p className="status-text status-error">{error}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>청첩장 관리자</h1>
          <p>참석 답변과 방명록을 확인합니다.</p>
        </div>
        <div className="admin-actions">
          <button className="secondary-button" type="button" onClick={loadAdminData} disabled={loading}>
            새로고침
          </button>
          <button className="primary-button" type="button" onClick={downloadCsv}>
            <Download size={16} aria-hidden />
            CSV
          </button>
          <button className="secondary-button" type="button" onClick={logout} disabled={loading}>
            <LogOut size={16} aria-hidden />
            로그아웃
          </button>
        </div>
      </header>

      {error ? <p className="status-text status-error">{error}</p> : null}

      <section className="admin-panel">
        <h2>RSVP</h2>
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>구분</th>
                <th>참석</th>
                <th>식사</th>
                <th>동행</th>
                <th>연락처</th>
                <th>메모</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((rsvp) => (
                <tr key={rsvp.id}>
                  <td>{rsvp.name}</td>
                  <td>{rsvp.side === "groom" ? "신랑측" : "신부측"}</td>
                  <td>{rsvp.attendance === "attending" ? "참석" : "불참"}</td>
                  <td>{rsvp.meal ?? "-"}</td>
                  <td>{rsvp.companion_count}</td>
                  <td>{rsvp.phone ?? "-"}</td>
                  <td>{rsvp.memo ?? "-"}</td>
                </tr>
              ))}
              {rsvps.length === 0 ? (
                <tr>
                  <td colSpan={7}>저장된 RSVP가 없습니다.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel">
        <h2>방명록</h2>
        <div className="admin-guestbook-list">
          {entries.map((entry) => (
            <article className="admin-guestbook-item" key={entry.id}>
              <div>
                <strong>{entry.name}</strong>
                <p>{entry.message}</p>
                <span>
                  {entry.is_visible ? "공개" : "숨김"}
                  {entry.deleted_at ? " · 삭제" : ""}
                </span>
              </div>
              <div className="admin-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => updateGuestbook(entry.id, entry.is_visible ? "hide" : "show")}
                  disabled={Boolean(entry.deleted_at)}
                >
                  {entry.is_visible ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
                  {entry.is_visible ? "숨김" : "공개"}
                </button>
                <button className="secondary-button" type="button" onClick={() => updateGuestbook(entry.id, "delete")}>
                  <Trash2 size={16} aria-hidden />
                  삭제
                </button>
              </div>
            </article>
          ))}
          {entries.length === 0 ? <p>저장된 방명록이 없습니다.</p> : null}
        </div>
      </section>
    </main>
  );
}
