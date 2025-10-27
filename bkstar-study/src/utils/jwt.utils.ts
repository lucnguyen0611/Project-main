import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
    id: number;
    name: string;
    email: string;
    role: "teacher" | "student" | "admin";
    parent_name?: string | null;
    parent_phone?: string | null;
    school?: string | null;
    avatar?: {
        id: number | null;
        url: string | null;
    };
    exp: number;
    iat?: number;
}

export const decodeToken = (token: string): JWTPayload => {
    try {
        return jwtDecode<JWTPayload>(token);
    } catch (error) {
        throw new Error("Invalid token");
    }
};

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = decodeToken(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

export const isTokenExpiringSoon = (
    token: string,
    minutes: number = 5
): boolean => {
    try {
        const decoded = decodeToken(token);
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = decoded.exp - currentTime;
        return timeUntilExpiry < minutes * 60;
    } catch (error) {
        return true;
    }
};

export const getUserInfoFromToken = (token: string) => {
    try {
        const decoded = decodeToken(token);
        return {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            parent_name: decoded.parent_name ?? null,
            parent_phone: decoded.parent_phone ?? null,
            school: decoded.school ?? null,
            avata: decoded.avatar ?? { id: null, url: null },
            exp: decoded.exp,
        };
    } catch (error) {
        return null;
    }
};
