import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({ example: 'nuevo@yuxbank.com', description: 'Nuevo correo del usuario' })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  nuevoCorreo: string;
}