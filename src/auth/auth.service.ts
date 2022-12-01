import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities';
import { EXPIRES_IN } from './const';
import { AuthDto } from './dto';
import { Roles } from '../users/enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto) {
    let loggedInUser: boolean | User = await this.usersService.getUnscopedUser({
      username: authDto.username,
    });

    if (!loggedInUser) {
      const admin = await this.usersService.getUnscopedUser({
        role: Roles.ADMIN,
      });

      if (!admin) {
        // create a default admin if there is none
        loggedInUser = await this.usersService.createAdministrator();
      }
    }

    if (!loggedInUser) {
      throw new ForbiddenException('Invalid username or password!');
    }

    // compare the given passwords
    const isPasswordMatching = await bcrypt.compare(
      authDto.password,
      loggedInUser.password,
    );

    if (!isPasswordMatching) {
      throw new ForbiddenException('Invalid username or password!');
    }

    return {
      access_token: this.signToken(loggedInUser.id, loggedInUser.username),
      userId: loggedInUser.id,
      role: loggedInUser.role,
      expires_in: EXPIRES_IN,
    };
  }

  signToken(userId: string, username: string) {
    const payload = {
      sub: userId,
      username,
    };

    const options: JwtSignOptions = {
      expiresIn: EXPIRES_IN,
      algorithm: 'RS256',
    };

    return this.jwtService.sign(payload, options);
  }
}
