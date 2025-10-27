import {Injectable} from "@nestjs/common";
import type {InvitationI, InvitationServiceI, ClassUserServiceI, ClassServiceI, UserServiceI} from "@/shares";
import {ClassUserServiceToken, ClassServiceToken, UserServiceToken} from "@/shares";
import {HttpException, HttpStatus} from "@nestjs/common";
import {Inject} from "@nestjs/common";
import {Transactional} from "typeorm-transactional";

@Injectable()
export class InvitationService implements InvitationServiceI{
    constructor(
        @Inject(ClassUserServiceToken)
        private readonly classUserService: ClassUserServiceI,
        @Inject(ClassServiceToken)
        private readonly classService: ClassServiceI,
        @Inject(UserServiceToken)
        private readonly userService: UserServiceI,
    ){}

    @Transactional()
    async invite(invitation: InvitationI){
        // check if the user is already in the class
        const theClassUser = await this.classUserService.findOneBy({
            class_id: invitation.class_id,
            user_id: invitation.user_id
        })
        if(theClassUser) throw new HttpException('User already in the class', HttpStatus.BAD_REQUEST);

        const theClass = await this.classService.findOne(invitation.class_id);
        const theUser = await this.userService.findOne(invitation.user_id);
        if(!theClass || !theUser) throw new HttpException('User or class not found', HttpStatus.NOT_FOUND);

        const passcode = theClass.code;
        if(passcode === invitation.code){
            await this.classUserService.create({
                class_id: invitation.class_id,
                user_id: invitation.user_id
            })
            return {msg: 'User has successfully been added to the class!'}
        } else {
            throw new HttpException('Invalid passcode', HttpStatus.BAD_REQUEST);
        }

    }
}
