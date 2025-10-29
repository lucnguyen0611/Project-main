export enum Role {
  ADMIN = 'admin',
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export interface AvatarInfo {
  id: number;
  url: string;
}

export interface UserBase {
  name: string;
  email: string;
  status?: string;
  school?: string | null;
  parent_name?: string | null;
  parent_phone?: string | null;
}

export interface UserI extends UserBase {
  id: number;
  role: Role;
  avatar: number | null;
}

export type UserReqI = UserBase;

export interface UserResI extends Omit<UserI, 'avatar'> {
  avatar_info: AvatarInfo | null;
}

export interface RegisterReqI extends UserReqI {
  role: Role;
  password: string;
}

export interface UserWithPassI extends UserResI {
  password: string;
}

export interface LoginReqI {
  email: string;
  password: string;
}

export interface LoginResI {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayloadData {
  name: string;
  email: string;
  role: Role;
  avatar_info: AvatarInfo | null;
}

export interface ChangePasswordReqI {
  old_password: string;
  new_password: string;
}

export interface RequestWithUser extends Request {
  user: UserResI;
}
