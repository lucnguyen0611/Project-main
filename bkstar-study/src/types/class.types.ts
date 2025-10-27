export interface ClassUser {
    id: number;
    name: string;
    status: "confirming" | "pending" | "rejected";
    role: "teacher" | "student";
}

export interface Class {
    id: number;
    name: string;
    code: string;
    users: ClassUser[];
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
