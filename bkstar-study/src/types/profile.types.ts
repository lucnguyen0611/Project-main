export interface Avatar {
    id: number;
    url: string;
    payload: string;
}

export interface ProfileData {
    name: string;
    email: string;
    school?: string | null;
    parent_name?: string | null;
    parent_phone?: string | null;
    avata?: Avatar | null;
}

export interface UpdateProfileRequest {
    name: string;
    email: string;
    school?: string | null;
    parent_name?: string | null;
    parent_phone?: string | null;
    avata?: Avatar | null;
}

export interface ChangePasswordRequest {
    id: number;
    old_password: string; // Base64 encoded
    new_password: string; // Base64 encoded
}

export interface ProfileValidationErrors {
    name?: string;
    school?: string;
    parent_name?: string;
    parent_phone?: string;
}

export interface PasswordValidationErrors {
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
}
