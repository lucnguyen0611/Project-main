import {UserBase, UserI, UserResI} from '@/shares/type/user';

export interface StudentBase extends UserBase {
}

export interface StudentI extends UserI {
}

export interface StudentReqI extends StudentBase {
}

export interface StudentResI extends UserResI {
}
