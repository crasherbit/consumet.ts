"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.installFlareSolverr = installFlareSolverr;
const axios_1 = __importStar(require("axios"));
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
function installFlareSolverr(axiosInstance, config) {
    var _a;
    const flareSolverrUrl = config.url;
    const maxTimeout = (_a = config.maxTimeout) !== null && _a !== void 0 ? _a : 60000;
    axiosInstance.defaults.adapter = async (cfg) => {
        var _a, _b, _c;
        // Build the full URL
        let targetUrl = (_a = cfg.url) !== null && _a !== void 0 ? _a : '';
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
        console.log(`[FlareSolverr] ${(_c = (_b = cfg.method) === null || _b === void 0 ? void 0 : _b.toUpperCase()) !== null && _c !== void 0 ? _c : 'GET'} ${targetUrl}`);
        const flareResponse = await axios_1.default.post(flareSolverrUrl, {
            cmd: 'request.get',
            url: targetUrl,
            maxTimeout: maxTimeout,
        });
        const solution = flareResponse.data.solution;
        // Try to parse as JSON if possible (for API endpoints that return JSON)
        let data = solution.response;
        try {
            data = JSON.parse(solution.response);
        }
        catch (_d) {
            // Keep as string — this is fine for HTML pages (cheerio)
        }
        return {
            data,
            status: solution.status,
            statusText: 'OK',
            headers: new axios_1.AxiosHeaders(solution.headers),
            config: cfg,
        };
    };
}
//# sourceMappingURL=flaresolverr.js.map