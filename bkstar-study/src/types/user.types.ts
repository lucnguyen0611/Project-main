export interface Avatar {
    id: number;
    url: string;
    payload: string;
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    school?: string | null;
    parent_name?: string | null;
    parent_phone?: string | null;
    avatar?: Avatar | null;
    role: "teacher" | "student" | "admin";
    status: "active" | "inactive" | "confirming";
    created_at: string;
    updated_at: string;
}

export interface UpdateProfileRequest {
    name: string;
    email: string;
    school?: string | null;
    parent_name?: string | null;
    parent_phone?: string | null;
    avatar?: Avatar | null;
}

export interface ChangePasswordRequest {
    id: number;
    old_password: string; // Base64 encoded
    new_password: string; // Base64 encoded
}

export interface ChangePasswordResponse {
    message: string;
    success: boolean;
}

export interface UserClassI {
    id: number;
    name: string;
    role: 'student' | 'teacher' | 'admin';
    status: 'pending' | 'confirming' | 'rejected';
}

export interface Course {
    id: number,
    code: string,
    name: string,
    users: UserClassI[],
}