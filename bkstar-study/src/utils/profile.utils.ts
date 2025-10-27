import type {
    ProfileValidationErrors,
    PasswordValidationErrors,
} from "@/types/profile.types";

/**
 * Validate profile data
 */
export const validateProfileData = (data: {
    name: string;
    school?: string | null;
    parent_name?: string | null;
    parent_phone?: string | null;
}): ProfileValidationErrors => {
    const errors: ProfileValidationErrors = {};

    // Validate name
    if (!data.name.trim()) {
        errors.name = "Tên không được để trống";
    } else if (data.name.trim().length < 2) {
        errors.name = "Tên phải có ít nhất 2 ký tự";
    }

    // Validate parent phone (if provided)
    if (data.parent_phone && data.parent_phone.trim()) {
        const phoneRegex = /^[0-9]{9,10}$/;
        if (!phoneRegex.test(data.parent_phone.trim())) {
            errors.parent_phone = "Số điện thoại phải có 9-10 số";
        }
    }

    return errors;
};

/**
 * Validate password data
 */
export const validatePasswordData = (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
}): PasswordValidationErrors => {
    const errors: PasswordValidationErrors = {};

    // Validate current password
    if (!data.current_password.trim()) {
        errors.current_password = "Mật khẩu hiện tại không được để trống";
    }

    // Validate new password
    if (!data.new_password.trim()) {
        errors.new_password = "Mật khẩu mới không được để trống";
    } else if (data.new_password.length < 6) {
        errors.new_password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate confirm password
    if (!data.confirm_password.trim()) {
        errors.confirm_password = "Nhập lại mật khẩu không được để trống";
    } else if (data.new_password !== data.confirm_password) {
        errors.confirm_password = "Mật khẩu nhập lại không khớp";
    }

    return errors;
};

/**
 * Encode string to Base64
 */
export const encodeToBase64 = (str: string): string => {
    if (typeof window !== "undefined") {
        // Browser environment
        return btoa(unescape(encodeURIComponent(str)));
    } else {
        // Node.js environment
        return Buffer.from(str, "utf8").toString("base64");
    }
};

/**
 * Convert File to Base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === "string") {
                // Remove data:image/jpeg;base64, prefix
                const base64 = reader.result.split(",")[1];
                resolve(base64);
            } else {
                reject(new Error("Failed to convert file to base64"));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Decode Base64 to string
 */
export const decodeFromBase64 = (str: string): string => {
    if (typeof window !== "undefined") {
        // Browser environment
        return decodeURIComponent(escape(atob(str)));
    } else {
        // Node.js environment
        return Buffer.from(str, "base64").toString("utf8");
    }
};
