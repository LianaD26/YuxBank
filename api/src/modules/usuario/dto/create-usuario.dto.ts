import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  apellido: string;

  @ApiProperty({ example: 'juan.perez@example.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña en texto (será hasheada)' })
  @IsString()
  contrasena: string;

  @ApiProperty({ example: 'activo', enum: ['activo', 'inactivo'], required: false })
  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  estado?: 'activo' | 'inactivo';
}