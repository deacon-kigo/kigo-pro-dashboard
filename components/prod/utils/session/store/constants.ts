import type { SessionData } from "@/components/prod/utils/session/store/types";

const SESSION_KEYS = {
  accessToken: "accessToken",
  email: "email",
  isLoggedIn: "isLoggedIn",
  name: "name",
  refreshToken: "refreshToken",
  role: "role",
} as const;

const COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: parseInt(process.env.REFRESH_TOKEN_DURATION_DAYS, 10) * 24 * 60 * 60,
  sameSite: "lax",
  secure: true,
} as const;

const DEFAULT_SESSION: SessionData = {
  accessToken: null,
  email: null,
  isLoggedIn: false,
  name: null,
  refreshToken: null,
  role: null,
};

const NAMESPACE = "kigo-pro:session";

export { COOKIE_OPTIONS, DEFAULT_SESSION, NAMESPACE, SESSION_KEYS };
