import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './user.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  async signUp(body: any) {
    const { email, password } = body;
    const exstingUser = await this.userModel.findOne({ email: email });

    if (!(email && password)) {
      throw new NotFoundException('Email and Passowrd are required!');
    }
    if (exstingUser?.email === email) {
      throw new NotFoundException('Email already exist!');
    }
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email: email,
      password: hashedPass,
    });
    return await newUser.save();
  }

  async signIn(body: any): Promise<any> {
    try {
      const { email, password } = body;
      const existingUser = await this.userModel.findOne({ email: email });
      const passCheck = await bcrypt.compare(password, existingUser?.password);

      if (!passCheck) {
        throw new UnauthorizedException('Invalid Email or Password!');
      }
      const payload = { email: email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new NotFoundException('Invalid Email or Password!');
    }
  }

  getProfile() {
    return {
      user: {
        name: 'Demo User',
        age: 25,
        gender: 'Male',
      },
    };
  }
}
