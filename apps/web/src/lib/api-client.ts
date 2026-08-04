export interface StandardResponse<T> {
  success: boolean;
  data: T | null;
  error: any | null;
  meta?: any;
}

export const apiClient = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<StandardResponse<T>> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  
  let cookieHeader = '';
  
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    const token = cookies().get('token')?.value;
    if (token) {
      cookieHeader = `token=${token}`;
    }
  }

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...options?.headers,
      },
    });

    const payload = (await res.json()) as StandardResponse<T>;

    if (!payload.success || !res.ok) {
      throw new Error(payload.error?.message || 'An unknown error occurred');
    }

    return payload;
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
};
