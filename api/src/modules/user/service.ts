import {BaseService} from '@/modules/base/service';
import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common';
import {UserEntity} from '@/modules/user/entity';
import {
    UserEntityRepository,
    UserReqI,
    UserResI,
    UserWithPassI,
    UserServiceI,
    ChangePasswordReqI,
} from '@/shares';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {ClsService} from "nestjs-cls";
import * as bcrypt from 'bcrypt';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class UserService
    extends BaseService<UserEntity, UserReqI, UserResI>
    implements UserServiceI {
    constructor(
        @Inject(UserEntityRepository)
        protected readonly repository: Repository<UserEntity>,
        protected readonly cls: ClsService,
        private readonly configService: ConfigService,
    ) {
        super(repository, cls);
    }

    // remove password for security
    // remove id to avoid conflict when joining with FileEntity
    protected getPublicColumns(): string[] {
        return super.getPublicColumns().filter((column) => !['password', 'avatar', 'id'].includes(column));
    }

    protected handleSelect(): SelectQueryBuilder<UserEntity> {
        return this.repository
            .createQueryBuilder(this.getTableName())
            .select('user.id AS id')    // avoid conflict with FileEntity.id
            .addSelect(this.getPublicColumns())
            .addSelect(`
            CASE WHEN user_file.id IS NULL THEN NULL
                 ELSE json_build_object('id', user_file.id, 'url', user_file.url)
            END as avatar_info
        `)
            .leftJoin('user.file', 'user_file');
    }

    async findUserByEmailWithPassword(email: string): Promise<UserWithPassI | null> {
        const response: UserWithPassI | undefined = await this.handleSelect()
            .addSelect('user.password AS password')
            .where('user.email = :email and user.active = :active', {email, active: true})
            .getRawOne<UserWithPassI>();
        if (!response) return null;
        return response;
    }

    private async findUserByIdWithPassword(id: number): Promise<UserWithPassI | null> {
        const response: UserWithPassI | undefined = await this.handleSelect()
            .addSelect('user.password AS password')
            .where('user.id = :id and user.active = :active', {id: id, active: true})
            .getRawOne<UserWithPassI>();
        if (!response) return null;
        return response;
    }

    async changePassword(data: ChangePasswordReqI){
        const userId: number | null = this.getAuthenticatedUserId();
        if (!userId) throw new UnauthorizedException('Unauthorized');

        const user: UserWithPassI | null = await this.findUserByIdWithPassword(userId);
        if (!user) throw new InternalServerErrorException('Internal server error');

        // check if the old password is correct
        const {old_password, new_password} = data;
        const isPasswordMatching: boolean = await bcrypt.compare(old_password, user.password);
        if (!isPasswordMatching) throw new BadRequestException('Password is incorrect');

        // check if the new password is the same as the old password
        if (old_password === new_password) throw new BadRequestException('New password cannot be the same as the old password');

        // hash the new password before saving
        const saltRounds: number | undefined = this.configService.get<number>('BCRYPT_SALT_ROUNDS');
        if (!saltRounds) throw new InternalServerErrorException('Not found salt rounds in config');
        // the type of saltRounds is still string
        const hashedPassword: string = await bcrypt.hash(new_password, Number(saltRounds));
        await this.repository.update({id: userId}, {password: hashedPassword});
        return {msg: 'Successfully changed password'};

    }
}
