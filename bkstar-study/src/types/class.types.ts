export interface ClassUser {
    id: number;
    name: string;
    role: "teacher" | "student";
    status: "confirming" | "pending" | "rejected";
}

export interface Class {
    id: number;
    name: string;
    code: string;
    students: ClassUser[];
    teachers: ClassUser[];
    created_at?: string;
    updated_at?: string;
    description?: string;
    status?: "active" | "inactive";
}

export interface CreateClassRequest {
    name: string;
    code: string;
    users: number[];
}

export interface CreateClassResponse {
    class: Class;
    message: string;
}

export interface ClassListResponse {
    classes: Class[];
    total: number;
    page: number;
    limit: number;
}
