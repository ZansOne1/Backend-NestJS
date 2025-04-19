import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './auth/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql', // postgres atau 'mysql'
    host: 'localhost',
    port: 3306, // MySQL: 3306 atau postgres 5432
    username: 'root', // postgres atau 'root'
    password: '',
    database: 'projecttask',
    entities: [Users],
    synchronize: true, // development only
  }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


