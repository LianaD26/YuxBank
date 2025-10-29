import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  correo: string;

  @ApiProperty()
  @IsString()
  contrasena: string;
}