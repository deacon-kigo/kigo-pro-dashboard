const API_URL = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL;

const TOKEN_KEY = "tmt_access_token";
const REFRESH_TOKEN_KEY = "tmt_refresh_token";
const USER_KEY = "tmt_user";

export interface User {
  name: string;
  email: string;
  role: string | null;
}

export interface LoginResponse {
  name: string;
  email: string;
  access_token: string;
  refresh_token: string;
  role: string | null;
}

export interface RefreshResponse {
  access_token: string;
}

class AuthService {
  private refreshTimer: NodeJS.Timeout | null = null;

  // Login with email and password
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/dashboard/auth/log-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Login failed");
    }

    const data: LoginResponse = await response.json();

    // Store tokens and user info
    this.setTokens(data.access_token, data.refresh_token);
    this.setUser({
      name: data.name,
      email: data.email,
      role: data.role,
    });

    // Start auto-refresh timer
    this.startRefreshTimer();

    return data;
  }

  // Refresh access token
  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/dashboard/auth/access-tokens/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }
      );

      if (!response.ok) {
        // Refresh token expired or invalid
        this.logout();
        return null;
      }

      const data: RefreshResponse = await response.json();

      // Update access token
      this.setAccessToken(data.access_token);

      // Restart refresh timer
      this.startRefreshTimer();

      return data.access_token;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      this.logout();
      return null;
    }
  }

  // Logout - call API and clear all tokens and user data
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();

    // Call logout endpoint if we have a refresh token
    if (refreshToken) {
      try {
        await fetch(`${API_URL}/dashboard/auth/log-out`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        // Silently fail - we still want to clear local state
        console.error("Logout API call failed:", error);
      }
    }

    // Clear local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.stopRefreshTimer();
  }

  // Get current access token
  getAccessToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }

  // Get refresh token
  getRefreshToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  // Get current user
  getUser(): User | null {
    if (typeof window === "undefined") {
      return null;
    }
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  // Set access token
  private setAccessToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  // Set both tokens
  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  // Set user data
  private setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  // Start auto-refresh timer (refresh 1 minute before expiration)
  // Access token expires in 30 mins, so refresh at 29 mins
  startRefreshTimer(): void {
    this.stopRefreshTimer();

    // Refresh token 1 minute before it expires (29 minutes = 29 * 60 * 1000 ms)
    const refreshInterval = 29 * 60 * 1000;

    this.refreshTimer = setTimeout(async () => {
      await this.refreshAccessToken();
    }, refreshInterval);
  }

  // Stop refresh timer
  stopRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // Initialize auth state (call on app load)
  // Does NOT call refresh endpoint on every page load
  // Refresh happens either via timer (29 min) or as 401 interceptor in api.ts
  initialize(): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Just start the refresh timer - don't call refresh endpoint on page load
    // The refresh will happen:
    // 1. On 401 response (handled in api.ts interceptor)
    // 2. On timer before token expires (29 minutes)
    this.startRefreshTimer();
    return true;
  }
}

export const authService = new AuthService();
