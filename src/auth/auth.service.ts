import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/interface/users.interface';
import { RegisterDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import ms from 'ms';
// import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    // private roleService: RolesService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  // username and password are passed from the login method
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    if (user) {
      const isValid = this.usersService.isValidPasword(pass, user.password);
      if (isValid) {
        const userRole = user.role as unknown as { id: number, name: string };

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: userRole ? {
            id: userRole.id,
            name: userRole.name
          } : null
        }
      };
    }
    return null;
  }

  createRefreshToken(payload : any) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRE")
    });
    return refreshToken;
  }

  async login(user: IUser, response: Response) {
    const { id, email, name, role } = user;
    const payload = { 
      sub: "token login",
      iss: "from server",
      id,
      email,
      name,
      role
    };

    const refreshToken = this.createRefreshToken(payload);

    // update user with refresh token
    await this.usersService.updateUserToken(user.id, refreshToken);

    // set refresh token as cookie
    response.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id,
        email,
        name,
        role
      }
    };
  }

  async register(regiterDto : RegisterDto) {
    const newUser = await this.usersService.register(regiterDto);
    return {
      id: newUser?.id,
      createAt: newUser?.createAt
    };
  }

  async processNewToken(request: Request, response : Response) {
    try {
      const refreshToken = request.cookies["refresh_token"];
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET")
      });
      const user = await this.usersService.findOneByRefreshToken(refreshToken);
      if (user) {
        const { id, email, name, role } = user;
        const payload = { 
          sub: "token login",
          iss: "from server",
          id,
          email,
          name,
          role
        };
    
        const refreshToken = this.createRefreshToken(payload);
    
        // update user with refresh token
        await this.usersService.updateUserToken(user.id, refreshToken);
    
        // set refresh token as cookie
        response.clearCookie("refresh_token");
        response.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
        });
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            id,
            email,
            name,
            role
          }
        }
      } else {
        throw new BadRequestException("Invalid refresh token");
      }
    }
    catch (error) {
      throw new BadRequestException("Invalid refresh token");
    }
  }

  async logout(user: IUser, response : Response) {
    await this.usersService.updateUserToken(user.id, "");
    response.clearCookie("refresh_token");
    return null;
  }
}