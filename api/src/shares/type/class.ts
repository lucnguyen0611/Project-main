import {Role} from "@/shares";

interface ClassBaseI {
    name: string;
    code: string;
}

interface Member {
    id: number;
    name: string;
    email: string;
    role: Role;
}

// select
export interface ClassI extends ClassBaseI {
    id: number;
}

// create or update
export interface ClassReqI extends ClassBaseI {}

// response
export interface ClassResI extends ClassI {
    teachers: Member[];
    students: Member[];
}


