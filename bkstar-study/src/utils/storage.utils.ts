import Cookies from "js-cookie";
import { COOKIE_CONFIG } from "@/config/api.config";

const isSecureEnvironment = typeof window !== "undefined" && window.location.protocol === "https:";

// Cookie utilities using js-cookie
export const setCookie = (name: string, value: string, options: any = {}) => {
    const cookieOptions = {
        path: "/",
        secure: isSecureEnvironment, // chỉ secure khi chạy https
        sameSite: "strict" as const,
        ...options,
    };

    try {
        Cookies.set(name, value, cookieOptions);
    } catch (e) {
        console.error("setCookie error", name, e);
    }
};

export const getCookie = (name: string): string | null => {
    try {
        const v = Cookies.get(name);
        return v === undefined ? null : v;
    } catch (e) {
        console.error("getCookie error", name, e);
        return null;
    }
};

export const deleteCookie = (name: string, options: any = {}) => {
    const cookieOptions = {
        path: "/",
        ...options,
    };

    try {
        Cookies.remove(name, cookieOptions);
    } catch (e) {
        console.error("deleteCookie error", name, e);
    }
};

// Token management
// Accept string | null | undefined to be safe
export const setAccessToken = (token: string | null | undefined, rememberMe: boolean = false) => {
    if (!token) {
        console.warn("setAccessToken called with empty token, clearing existing token");
        deleteCookie(COOKIE_CONFIG.accessToken.name);
        return;
    }

    const expires = rememberMe ? 7 : 60; // days
    console.log("Setting access token:", {
        name: COOKIE_CONFIG.accessToken.name,
        expires,
        tokenLength: token.length,
        secure: isSecureEnvironment,
    });

    setCookie(COOKIE_CONFIG.accessToken.name, token, {
        expires,
        path: "/",
    });

    // Verify cookie was set
    const savedToken = getCookie(COOKIE_CONFIG.accessToken.name);
    console.log("Access token saved:", {
        saved: !!savedToken,
        savedLength: savedToken ? savedToken.length : 0,
    });
};

export const setRefreshToken = (token: string | null | undefined, rememberMe: boolean = false) => {
    if (!token) {
        console.warn("setRefreshToken called with empty token, clearing existing token");
        deleteCookie(COOKIE_CONFIG.refreshToken.name);
        return;
    }

    const expires = rememberMe ? 30 : 7; // days
    console.log("Setting refresh token:", {
        name: COOKIE_CONFIG.refreshToken.name,
        expires,
        tokenLength: token.length,
        secure: isSecureEnvironment,
    });

    setCookie(COOKIE_CONFIG.refreshToken.name, token, {
        expires,
        path: "/",
    });

    const savedToken = getCookie(COOKIE_CONFIG.refreshToken.name);
    console.log("Refresh token saved:", {
        saved: !!savedToken,
        savedLength: savedToken ? savedToken.length : 0,
    });
};

export const getAccessToken = (): string | null => {
    const token = getCookie(COOKIE_CONFIG.accessToken.name);
    console.log("Getting access token:", {
        name: COOKIE_CONFIG.accessToken.name,
        found: !!token,
        length: token ? token.length : 0,
    });
    return token;
};

export const getRefreshToken = (): string | null => {
    const token = getCookie(COOKIE_CONFIG.refreshToken.name);
    console.log("Getting refresh token:", {
        name: COOKIE_CONFIG.refreshToken.name,
        found: !!token,
        length: token ? token.length : 0,
    });
    return token;
};

export const clearTokens = () => {
    console.log("Clearing tokens");
    deleteCookie(COOKIE_CONFIG.accessToken.name);
    deleteCookie(COOKIE_CONFIG.refreshToken.name);
    console.log("Tokens cleared");
};

// Remember Me functionality
export const setRememberEmail = (email: string) => {
    setCookie("remember_email", email, {
        expires: 30, // 30 days
        path: "/",
    });
};

export const getRememberEmail = (): string | null => {
    return getCookie("remember_email");
};

export const clearRememberEmail = () => {
    deleteCookie("remember_email");
};
