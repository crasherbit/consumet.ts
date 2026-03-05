import axios, { AxiosInstance, AxiosResponse, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

/**
 * FlareSolverr integration for bypassing Cloudflare protection.
 *
 * Replaces the axios adapter so all HTTP requests are routed through
 * a FlareSolverr instance (headless browser that solves Cloudflare challenges).
 */

export interface FlareSolverrConfig {
  /** FlareSolverr endpoint, e.g. "http://flaresolverr:8191/v1" */
  url: string;
  /** Max timeout in ms for FlareSolverr to solve the challenge (default: 60000) */
  maxTimeout?: number;
}

interface FlareSolverrSolution {
  url: string;
  status: number;
  headers: Record<string, string>;
  response: string;
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: number;
    httpOnly: boolean;
    secure: boolean;
  }>;
  userAgent: string;
}

interface FlareSolverrApiResponse {
  status: string;
  message: string;
  solution: FlareSolverrSolution;
  startTimestamp: number;
  endTimestamp: number;
  version: string;
}

/**
 * Replaces the default adapter of an axios instance so that ALL requests
 * go through FlareSolverr. The response body is returned as-is (string).
 * Cheerio's `load()` works fine with string HTML.
 *
 * Usage:
 * ```ts
 * const provider = new ANIME.AnimeUnity();
 * installFlareSolverr(provider.getClient(), { url: 'http://flaresolverr:8191/v1' });
 * ```
 */
export function installFlareSolverr(axiosInstance: AxiosInstance, config: FlareSolverrConfig): void {
  const flareSolverrUrl = config.url;
  const maxTimeout = config.maxTimeout ?? 60000;

  axiosInstance.defaults.adapter = async (cfg: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    // Build the full URL
    let targetUrl = cfg.url ?? '';
    if (cfg.baseURL && !targetUrl.startsWith('http')) {
      targetUrl = cfg.baseURL.replace(/\/$/, '') + '/' + targetUrl.replace(/^\//, '');
    }

    // Append query params if present
    if (cfg.params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(cfg.params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
      const qs = searchParams.toString();
      if (qs) {
        targetUrl += (targetUrl.includes('?') ? '&' : '?') + qs;
      }
    }

    console.log(`[FlareSolverr] ${cfg.method?.toUpperCase() ?? 'GET'} ${targetUrl}`);

    const flareResponse = await axios.post<FlareSolverrApiResponse>(flareSolverrUrl, {
      cmd: 'request.get',
      url: targetUrl,
      maxTimeout: maxTimeout,
    });

    const solution = flareResponse.data.solution;

    // Try to parse as JSON if possible (for API endpoints that return JSON)
    let data: any = solution.response;
    try {
      data = JSON.parse(solution.response);
    } catch {
      // Keep as string — this is fine for HTML pages (cheerio)
    }

    return {
      data,
      status: solution.status,
      statusText: 'OK',
      headers: new AxiosHeaders(solution.headers),
      config: cfg,
    } as AxiosResponse;
  };
}
