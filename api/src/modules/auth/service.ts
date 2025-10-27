import type {
    AuthServiceI,
    UserServiceI,
    UserResI,
    LoginReqI,
    LoginResI,
    RegisterReqI,
    TokenPayloadData, UserWithPassI,
} from '@/shares';
import {UserServiceToken, UserEntityRepository, PasswordResetTokenRepository} from '@/shares';
import {HttpException, HttpStatus, Injectable, Inject} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {ForgotPasswordReq, RefreshTokenReq, ResetPasswordReq} from "@/modules/auth/dtos";
import {PasswordResetTokenEntity} from "@/modules/password_reset_token/entity";
import {MailServiceToken} from "@/infrastructure/mail/const";
import type {MailServiceI} from "@/infrastructure/mail/interface";
import {Repository} from "typeorm";
import {UserEntity} from "@/modules/user/entity";
import {Transactional} from "typeorm-transactional";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService implements AuthServiceI {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(PasswordResetTokenRepository)
        private readonly passwordResetTokenRepository: Repository<PasswordResetTokenEntity>,
        @Inject(MailServiceToken)
        private readonly mailService: MailServiceI,
        @Inject(UserServiceToken)
        private readonly userService: UserServiceI,
        @Inject(UserEntityRepository)
        private readonly userRepository: Repository<UserEntity>,

        private readonly configService: ConfigService,
    ) {
    }

    // register = create a new user
    async register(data: RegisterReqI) {
        // check if the email already exists
        const users: UserResI[] = await this.userService.find({
            email: data.email,
        });
        if (users.length > 0) {
            throw new HttpException('Email already registered', HttpStatus.CONFLICT);
        }

        // hash password before saving
        const saltRounds = 10;
        const hashedPassword: string = await bcrypt.hash(data.password, saltRounds);
        const newUser = {...data, password: hashedPassword};
        await this.userService.create(newUser);
        return {msg: 'Successfully registered'};
    }

    async login(data: LoginReqI): Promise<LoginResI> {
        // check if the email exists in the db
        const user: UserWithPassI | null = await this.userService.findUserByEmailWithPassword(data.email);
        if (!user) {
            throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
        }

        // check if the password is correct
        const isPasswordMatching: boolean = await bcrypt.compare(
            data.password,
            user.password,
        );
        if (!isPasswordMatching)
            throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);

        const payloadData: TokenPayloadData = {
            name: user.name,
            email: user.email,
            role: user.role,
            avatar_info: user?.avatar_info ?? null,
        }

        // make new JWT tokens and return them
        const payload = {sub: user.id, ...payloadData};

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);

        return { accessToken, refreshToken };
    }

    async refreshToken(data: RefreshTokenReq): Promise<LoginResI> {
        const {refreshToken} = data;
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });

            const user = await this.userService.findOne(payload.sub);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
            }

            const newPayloadData: TokenPayloadData = {
                name: user.name,
                email: user.email,
                role: user.role,
                avatar_info: user?.avatar_info ?? null,
            }
            const newPayload = {sub: user.id, ...newPayloadData};

            const [newAccessToken, newRefreshToken] = await Promise.all([
                this.jwtService.signAsync(newPayload, {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '15m',
                }),
                this.jwtService.signAsync(newPayload, {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                })
            ]);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            }

        } catch (e) {
            throw new HttpException('Invalid or expired refresh token', HttpStatus.UNAUTHORIZED);
        }
    }

    async forgotPassword(data: ForgotPasswordReq) {
        const {email} = data;
        const primaryResponse = {
            msg: 'If your email is registered, we have sent you an email with a link to reset your password.',
        };

        // find the user by email
        const user = await this.userService.findOneBy({email});
        if (!user) return primaryResponse;

        // create token
        const payload = {sub: user.id, type: 'password_reset'};
        const token: string = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
        });

        // calculate the exp time
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        // deactivate old tokens belong to the same user
        await this.passwordResetTokenRepository.update(
            {userId: user.id, isUsed: false},
            {isUsed: true},
        );

        // save token to the database
        await this.passwordResetTokenRepository.save({
            userId: user.id,
            token,
            expiresAt,
        });

        // send the email
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await this.mailService.sendMail({
            to: [user.email],
            subject: `Request to change password`,
            html: `
          <h1>Request to change password</h1>
          <p>Hello ${user.name},</p>
          <p>We have received your request to change your password. 
          Please click on the link below to continue. 
          This link will be expired in 15 minutes.</p>
          <a href="${resetLink}" 
            style="padding: 10px 20px; color: white; background-color: #007bff; 
            text-decoration: none; border-radius: 5px;">
            Reset the password
            </a>
          <p>If you did not request to change your password, please ignore this email.</p>
      `,
        });

        return primaryResponse;
    }

    @Transactional()
    async resetPassword(data: ResetPasswordReq) {
        const {token, newPassword} = data;

        // find the corresponding token record in the db
        const tokenRecord = await this.passwordResetTokenRepository.findOneBy({
            token,
        });
        if (
            !tokenRecord ||
            tokenRecord.isUsed ||
            tokenRecord.expiresAt < new Date()
        ) {
            throw new HttpException(
                'Invalid or expired token',
                HttpStatus.BAD_REQUEST,
            );
        }

        // get the user
        const user = await this.userService.findOne(tokenRecord.userId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // hash password before saving
        const saltRounds = 10;
        const hashedPassword: string = await bcrypt.hash(newPassword, saltRounds);
        // update the new password to the database
        await this.userRepository.update(user.id, {password: hashedPassword});
        // mark the token as used
        tokenRecord.isUsed = true;
        await this.passwordResetTokenRepository.save(tokenRecord);

        // return the message
        return {msg: 'Successfully changed password'};
    }

}
