export interface User {
    id: number;
    name: string;
    email: string;
    role: "teacher" | "student" | "admin";
    parent_name?: string | null;
    parent_phone?: string | null;
    school?: string | null;
    avata?: {
        id: number | null;
        url: string | null;
    };
    exp?: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user?: User;
}

export interface RegisterRequest {
    name: string;
    email: string;
    role: "student" | "teacher";
    status: "confirming";
    password: string;
}

export interface RegisterResponse {
    user: User;
    message: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isTeacher: boolean;
}
