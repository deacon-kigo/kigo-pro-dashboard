import type { SESSION_KEYS } from "./constants";

type KEYS = keyof typeof SESSION_KEYS;

type Role = "admin";

interface SessionData {
  accessToken: null | string;
  email: null | string;
  isLoggedIn: boolean;
  name: null | string;
  refreshToken: null | string;
  role: null | Role;
}

export type { KEYS, Role, SessionData };
