import { IsEmail, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';


export class AttachmentDto {
@IsString() filename!: string; // ex: "nota.pdf"
@IsString() content!: string; // base64
@IsString() @IsOptional() type?: string; // ex: "application/pdf"
@IsString() @IsOptional() disposition?: string; // ex: "attachment"
}


export class SendEmailDto {
@IsEmail() to!: string;


@IsString() @IsOptional() subject?: string; // obrigatório p/ email simples
@IsString() @IsOptional() text?: string;
@IsString() @IsOptional() html?: string;


// Para templates dinâmicos do SendGrid
@IsString() @IsOptional() templateId?: string; // se não enviar, usa default
@IsObject() @IsOptional() dynamicTemplateData?: Record<string, any>;


// Anexos
@IsArray() @ValidateNested({ each: true }) @Type(() => AttachmentDto)
@IsOptional() attachments?: AttachmentDto[];
}