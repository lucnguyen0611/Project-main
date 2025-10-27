import {UserBase, UserI, UserResI} from '@/shares/type/user';

export interface TeacherBase extends UserBase {}

export interface TeacherI extends UserI {}

export interface TeacherReqI extends TeacherBase {}

export interface TeacherResI extends UserResI {}
