import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
    sub: string; // ID người dùng dạng string trong token
    name: string;
    email: string;
    role: "teacher" | "student" | "admin";
    avatar_info?: {
        id: number | null;
        url: string | null;
    } | null;
    exp: number;
    iat?: number;
}

// 🔹 Giải mã token
export const decodeToken = (token: string): JWTPayload => {
    try {
        return jwtDecode<JWTPayload>(token);
    } catch (error) {
        throw new Error("Invalid token");
    }
};

// 🔹 Kiểm tra token hết hạn
export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = decodeToken(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

// 🔹 Kiểm tra token sắp hết hạn (mặc định 5 phút)
export const isTokenExpiringSoon = (token: string, minutes: number = 5): boolean => {
    try {
        const decoded = decodeToken(token);
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = decoded.exp - currentTime;
        return timeUntilExpiry < minutes * 60;
    } catch (error) {
        return true;
    }
};

// 🔹 Lấy thông tin user từ token
export const getUserInfoFromToken = (token: string) => {
    try {
        const decoded = decodeToken(token);
        return {
            id: Number(decoded.sub), // convert từ string → number
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            avatar: decoded.avatar_info ?? { id: null, url: null },
            exp: decoded.exp,
        };
    } catch (error) {
        return null;
    }
};
