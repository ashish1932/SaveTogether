// SaveTogether Admin Web API Client Helper (Step 4 Integration)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const token = localStorage.getItem('savetogether_admin_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || 'API request failed' };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to backend' };
  }
}

export const adminApi = {
  getHealth: () => apiRequest('/health'),
  getDashboardMetrics: () => apiRequest('/admin/analytics/summary'),
  getSocieties: () => apiRequest('/societies'),
  getServices: () => apiRequest('/services'),
  getBookings: () => apiRequest('/bookings'),
  getVendors: () => apiRequest('/vendors'),
  getUsers: () => apiRequest('/users'),
};
