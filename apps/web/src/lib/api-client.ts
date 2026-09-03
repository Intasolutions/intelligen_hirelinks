export interface StandardResponse<T> {
  success: boolean;
  data: T | null;
  error: any | null;
  meta?: any;
}

// NEXT_PUBLIC_API_URL is relative (e.g. "/api/v1") in production so the
// browser's request stays same-origin and next.config.mjs's rewrite can
// proxy it — same-origin is what keeps the auth cookie first-party (see
// the rewrites() comment in next.config.mjs). A relative URL only resolves
// against "the current page" though, which Node's server-side fetch has no
// notion of, so server-side callers (RSCs, layouts, route handlers) must
// use this to reach the real API origin directly instead.
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined' && process.env.API_PROXY_TARGET) {
    return `${process.env.API_PROXY_TARGET}/api/v1`;
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
};

export const apiClient = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<StandardResponse<T>> => {
  const baseUrl = getApiBaseUrl();

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
      // Next's fetch() Data Cache can still cache individual requests even
      // inside a route marked force-dynamic unless told explicitly not to —
      // admin edits (new partner logos, updated content, etc.) need to show
      // up on the very next request, not a stale cached one.
      cache: 'no-store',
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
