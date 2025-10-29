import {Module} from '@nestjs/common';
import {AuthController} from '@/modules/auth/controller';
import {UserModule} from '@/modules/user/module';
import {JwtModule} from '@nestjs/jwt';
import {PasswordResetTokenModule} from '@/modules/password_reset_token/module';
import {MailModule} from '@/infrastructure/mail/module';
import {AuthServiceToken} from '@/shares';
import {AuthService} from '@/modules/auth/service';
import {ConfigModule, ConfigService} from '@nestjs/config';

@Module({
    imports: [
        UserModule,
        MailModule,

        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_SECRET'),
                signOptions: {expiresIn: '15m'},
            }),
            inject: [ConfigService],
        }),

        // JwtModule.register({
        //   global: true,
        //   secret: process.env.PRIVATE_KEY,
        //   signOptions: { expiresIn: '10m' },
        // }),
        PasswordResetTokenModule,
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: AuthServiceToken,
            useClass: AuthService,
        },
    ],
})
export class AuthModule {
}
