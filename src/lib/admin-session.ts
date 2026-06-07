import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "mocheong_admin";
const MAX_AGE = 60 * 60 * 8;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

function sessionToken(password: string) {
  return crypto.createHash("sha256").update(`mocheong-admin:${password}`).digest("hex");
}

export function hasAdminPassword() {
  return Boolean(getAdminPassword());
}

export function verifyAdminPassword(input: string) {
  const password = getAdminPassword();
  if (!password) {
    return false;
  }

  const expected = Buffer.from(password);
  const actual = Buffer.from(input);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export async function createAdminSession() {
  const password = getAdminPassword();
  if (!password) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sessionToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE
  });

  return true;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthed() {
  const password = getAdminPassword();
  if (!password) {
    return false;
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) {
    return false;
  }

  const expected = Buffer.from(sessionToken(password));
  const actual = Buffer.from(value);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}
