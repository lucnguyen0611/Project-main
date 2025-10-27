import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {InvitationDto} from "@/modules/invitation/dtos";
import {InvitationServiceToken} from "@/shares";
import type {InvitationServiceI} from "@/shares";
import {Inject, Post, Body, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@/modules/auth/guard";

@ApiTags('Invitations')
@Controller('invitations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class InvitationController {
    constructor(
       @Inject(InvitationServiceToken)
       private readonly invitationService: InvitationServiceI
    ) {}

    @Post()
    invite(@Body() invitation: InvitationDto){
        return this.invitationService.invite(invitation);
    }
}