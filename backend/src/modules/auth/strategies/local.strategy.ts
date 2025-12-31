import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true, // Para ter acesso ao request e pegar companyId
    });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    const companyId = (req.body as any).companyId;
    const user = await this.authService.validateUser(email, password, companyId);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return user;
  }
}
