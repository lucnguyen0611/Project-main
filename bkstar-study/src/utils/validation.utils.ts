export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (
    password: string
): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Mật khẩu phải có ít nhất 1 chữ hoa");
    }

    if (!/[a-z]/.test(password)) {
        errors.push("Mật khẩu phải có ít nhất 1 chữ thường");
    }

    if (!/\d/.test(password)) {
        errors.push("Mật khẩu phải có ít nhất 1 số");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const validateName = (
    name: string
): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (name.trim().length < 2) {
        errors.push("Tên phải có ít nhất 2 ký tự");
    }

    if (name.trim().length > 30) {
        errors.push("Tên không được quá 50 ký tự");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const validateRequired = (
    value: string,
    fieldName: string
): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!value || value.trim().length === 0) {
        errors.push(`Vui lòng nhập ${fieldName}`);
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
