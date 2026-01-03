import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../../modules/users/entities/user.entity';

/**
 * Guard para controlar acesso baseado em empresa/partner
 *
 * Regras:
 * - ADMIN: Acesso total (bypassa guard)
 * - COADMIN da EMPRESA: Acessa todos os leads (empresa + partners)
 * - COADMIN de PARTNER: Acessa apenas leads do seu partner
 * - OPERATOR da EMPRESA: Acessa apenas leads da empresa
 * - OPERATOR de PARTNER: Acessa apenas leads do seu partner
 */
@Injectable()
export class CompanyAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    // ADMIN tem acesso total
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Usuário deve estar vinculado a uma empresa
    if (!user.companyId) {
      throw new ForbiddenException('Usuário não está vinculado a uma empresa');
    }

    // Anexar informações de acesso ao request para uso no service
    request.accessControl = {
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
      isPartner: user.company?.isPartner || false,
    };

    return true;
  }
}
