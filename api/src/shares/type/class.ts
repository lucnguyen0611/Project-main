import { Role } from '@/shares';

interface ClassBaseI {
  name: string;
  code: string;
}

export interface Member {
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
export type ClassReqI = ClassBaseI;

// response
export interface ClassResI extends ClassI {
  teachers: Member[];
  students: Member[];
}
