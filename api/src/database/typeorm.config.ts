import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'db.fwzjlmbqorsglrsmhjfv.supabase.co',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '_Soymedellin10',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: true,
  logging: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};