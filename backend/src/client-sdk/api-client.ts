export interface ApiClientConfig {
  baseUrl: string;
  accessToken?: string;
  refreshToken?: string;
  onTokenRefresh?: (newTokens: { accessToken: string; refreshToken: string }) => void;
  onUnauthenticated?: () => void;
}

export class ApiClient {
  private baseUrl: string;
  private accessToken?: string;
  private refreshToken?: string;
  private onTokenRefresh?: (newTokens: { accessToken: string; refreshToken: string }) => void;
  private onUnauthenticated?: () => void;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
    this.onTokenRefresh = config.onTokenRefresh;
    this.onUnauthenticated = config.onUnauthenticated;
  }

  public setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public clearTokens() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-Id': `REQ-FE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let response = await fetch(url, { ...options, headers });

    // Handle 401 Unauthorized & Token Refresh (Step 41.11)
    if (response.status === 401 && this.refreshToken && !endpoint.includes('auth/refresh') && !endpoint.includes('auth/login') && !endpoint.includes('auth/verify')) {
      const refreshed = await this.tryTokenRefresh();
      if (refreshed) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
        response = await fetch(url, { ...options, headers });
      } else {
        if (this.onUnauthenticated) this.onUnauthenticated();
        throw new Error('AUTH_SESSION_REVOKED: Session expired. Please log in again.');
      }
    }

    const data = await response.json();

    if (!response.ok || data.success === false) {
      const error: any = new Error(data.message || 'API Request Failed');
      error.statusCode = response.status;
      error.code = data.code || 'API_ERROR';
      error.data = data;
      throw error;
    }

    return data.data !== undefined ? data.data : data;
  }

  private async tryTokenRefresh(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      const json = await res.json();
      if (res.ok && json.success && json.data?.tokens) {
        this.accessToken = json.data.tokens.accessToken;
        this.refreshToken = json.data.tokens.refreshToken;
        if (this.onTokenRefresh) {
          this.onTokenRefresh(json.data.tokens);
        }
        return true;
      }
    } catch {
      // Refresh failed
    }
    this.clearTokens();
    return false;
  }
}
