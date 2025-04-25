import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../auth/entities/users.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private userRepo: Repository<Users>,
    ) { }

    async create(dto: CreateUserDto): Promise<Omit<Users, 'password'>> {
        const existing = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new BadRequestException('Email already exists');
        }
        const passwordPlain = dto.password || 'Telkom135!';
        const hashed = await bcrypt.hash(passwordPlain, 10);

        const newUser = this.userRepo.create({ ...dto, password: hashed });
        const saved = await this.userRepo.save(newUser);

        const { password, ...result } = saved;
        return result;
    }

    findAll(): Promise<Omit<Users, 'password'>[]> {
        return this.userRepo.find().then(users =>
            users.map(({ password, ...rest }) => rest)
        );
    }

    async findOne(id: number): Promise<Omit<Users, 'password'> | null> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) return null;
        const { password, ...result } = user;
        return result;
    }

    async update(id: number, dto: UpdateUserDto): Promise<any> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) return null;

        // if (dto.password) {
        //     dto.password = await bcrypt.hash(dto.password, 10);
        // }

        await this.userRepo.update(id, dto);
        return { message: 'User updated' };
    }

    async remove(id: number): Promise<any> {
        await this.userRepo.delete(id);
        return { message: 'User deleted' };
    }
}
