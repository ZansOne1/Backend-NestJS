import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private userRepo: Repository<Users>,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto): Promise<Omit<Users, 'password'>> {
        // Cek apakah email sudah digunakan
        const existing = await this.userRepo.findOneBy({ email: dto.email });
        if (existing) {
            throw new Error('Email sudah terdaftar');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Buat user baru
        const user = this.userRepo.create({
            username: dto.username,
            email: dto.email,
            password: hashedPassword,
        });

        const saved = await this.userRepo.save(user);

        // Jangan return password ke frontend
        const { password, ...result } = saved;
        return result;
    }


    async login(dto: LoginDto): Promise<{ access_token: string; user: Omit<Users, 'password'> } | null> {
        // Dekripsi password
        const bytes = CryptoJS.AES.decrypt(dto.password, process.env.SECRET_KEY);
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

        const user = await this.userRepo.findOneBy({ email: dto.email });
        // console.log(user);
        if (!user) return null;

        const isMatch = await bcrypt.compare(decryptedPassword, user.password);
        if (!isMatch) return null;

        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);

        const { password, ...result } = user;
        return {
            access_token: token,
            user: result,
        };
    }


}
