import {
  UserReqI, UserWithPassI, UserResI,
  LoginReqI, LoginResI,
  StudentResI, StudentReqI,
  RegisterReqI,
  TeacherReqI, TeacherResI,
  FileI, FileReqI,
  ClassI, ClassReqI,
  ClassUserI, ClassUserReqI, InvitationI,
  ExamGroupI, ExamGroupReqI,
  QuestionReqI, QuestionResI,
  ExamReqI, ExamResI,
  AnswerReqI, AnswerResI, ExamResultReqI, ExamResultResI, ChangePasswordReqI, ClassResI,
} from '@/shares';
import {ForgotPasswordReq, RefreshTokenReq, ResetPasswordReq} from '@/modules/auth/dtos';

export interface BaseServiceI<RequestI, ResponseI> {
  find: (params?: any) => Promise<ResponseI[]>;
  findOne: (id: number) => Promise<ResponseI>;
  findOneBy: (params?: any) => Promise<ResponseI | null>;
  create: (data: RequestI) => Promise<ResponseI>;
  updateOne: (id: number, data: Partial<RequestI>) => Promise<ResponseI>;
  softDelete: (id: number) => Promise<{ msg: string }>;
}

export interface UserServiceI extends BaseServiceI<UserReqI, UserResI> {
  findUserByEmailWithPassword: (email: string) => Promise<UserWithPassI | null>;
  changePassword: (data: ChangePasswordReqI) => Promise<{ msg: string }>;
}

export type StudentServiceI = BaseServiceI<StudentReqI, StudentResI>;
export type TeacherServiceI = BaseServiceI<TeacherReqI, TeacherResI>;

export interface AuthServiceI {
  login: (data: LoginReqI) => Promise<LoginResI>;
  register: (data: RegisterReqI) => Promise<{ msg: string }>;
  forgotPassword: (data: ForgotPasswordReq) => Promise<{ msg: string }>;
  resetPassword: (data: ResetPasswordReq) => Promise<{ msg: string }>;
  refreshToken: (data: RefreshTokenReq) => Promise<LoginResI>;
}

export interface FileServiceI extends BaseServiceI<FileReqI, FileI> {
  uploadAndCreateFile: (file: Express.Multer.File) => Promise<FileI>;
}

export interface ClassServiceI extends BaseServiceI<ClassReqI, ClassResI> {
  createAndJoinClass: (data: ClassReqI) => Promise<ClassI>;
}
export interface ClassUserServiceI extends BaseServiceI<ClassUserReqI, ClassUserI> {}
export interface InvitationServiceI {
  invite: (invitation: InvitationI) => Promise<{msg: string}>;
}

export interface ExamGroupServiceI extends BaseServiceI<ExamGroupReqI, ExamGroupI> {}
export interface QuestionServiceI extends BaseServiceI<QuestionReqI, QuestionResI>{
  createMany: (data: QuestionReqI[]) => Promise<QuestionResI[]>;
  updateMany: (data: QuestionReqI[]) => Promise<QuestionResI[]>;
}
export interface ExamServiceI extends BaseServiceI<ExamReqI, ExamResI> {}

export interface AnswerServiceI extends BaseServiceI<AnswerReqI, AnswerResI>{
  updateMany: (data: AnswerReqI[]) => Promise<AnswerResI[]>;
}

export interface ExamResultServiceI extends BaseServiceI<ExamResultReqI, ExamResultResI> {
  findAndFilter: (userId: number, examGroupId: number) => Promise<any[]>;
}