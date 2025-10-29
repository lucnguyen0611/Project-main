import {UserBase, UserI, UserResI} from '@/shares/type/user';

export interface AdminBase extends UserBase {
}

export interface AdminI extends UserI {
}

export interface AdminReqI extends AdminBase {
}

export interface AdminResI extends UserResI {
}
