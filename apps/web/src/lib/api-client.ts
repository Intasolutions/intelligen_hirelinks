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

  // Most unauthenticated routes in this API live under /public (see
  // getPublicServices/getPublicPrograms/etc. across the services/ folder).
  // GET /settings is the one exception — unauthenticated by design (only
  // its PUT requires auth) but not under /public, and it's called from the
  // shared public layout on every page, so it needs the same treatment.
  // Skipping the cookies() call for these lets the public pages that use
  // them (home, services, blog, ...) stay statically generated instead of
  // being forced fully dynamic by Next's cookies()-usage detection, which
  // would otherwise apply to every page rendering the shared layout.
  const isPublicEndpoint = endpoint.includes('/public') || endpoint === '/settings';

  if (typeof window === 'undefined' && !isPublicEndpoint) {
    const { cookies } = await import('next/headers');
    const token = cookies().get('token')?.value;
    if (token) {
      cookieHeader = `token=${token}`;
    }
  }

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      credentials: 'include',
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
