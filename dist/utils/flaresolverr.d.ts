import { AxiosInstance } from 'axios';
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
export declare function installFlareSolverr(axiosInstance: AxiosInstance, config: FlareSolverrConfig): void;
