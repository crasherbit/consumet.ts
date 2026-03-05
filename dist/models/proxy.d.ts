import { AxiosAdapter, AxiosInstance } from 'axios';
import { ProxyConfig } from './types';
export declare class Proxy {
    protected proxyConfig?: ProxyConfig | undefined;
    protected adapter?: AxiosAdapter | undefined;
    /**
     *
     * @param proxyConfig The proxy config (optional)
     * @param adapter The axios adapter (optional)
     */
    constructor(proxyConfig?: ProxyConfig | undefined, adapter?: AxiosAdapter | undefined);
    private validUrl;
    /**
     * Set or Change the proxy config
     */
    setProxy(proxyConfig: ProxyConfig): void;
    /**
     * Set or Change the axios adapter
     */
    setAxiosAdapter(adapter: AxiosAdapter): void;
    private rotateProxy;
    private toMap;
    /**
     * Returns the underlying axios client instance.
     * Useful for installing external interceptors (e.g. FlareSolverr).
     */
    getClient(): AxiosInstance;
    protected client: AxiosInstance;
}
export default Proxy;
