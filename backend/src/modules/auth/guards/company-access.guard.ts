import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CompanyAccessGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const targetUserId = request.params.id;

    // ADMIN pode acessar qualquer usuário
    if (currentUser.role === UserRole.ADMIN) {
      return true;
    }

    // Para outros perfis, verificar se pertence à mesma empresa
    if (
      currentUser.role === UserRole.COADMIN ||
      currentUser.role === UserRole.OPERATOR ||
      currentUser.role === UserRole.USER
    ) {
      // Se não tem companyId, não pode acessar outros usuários
      if (!currentUser.companyId) {
        throw new ForbiddenException(
          'Usuário sem empresa não pode gerenciar outros usuários',
        );
      }

      // Buscar usuário alvo
      const targetUser = await this.usersService.findOne(targetUserId);

      // Verificar se o usuário alvo pertence à mesma empresa
      if (targetUser.companyId !== currentUser.companyId) {
        throw new ForbiddenException(
          'Você só pode gerenciar usuários da sua empresa',
        );
      }

      // COADMIN pode gerenciar usuários da sua empresa
      if (currentUser.role === UserRole.COADMIN) {
        // COADMIN não pode gerenciar outros COADMIN ou ADMIN
        if (
          targetUser.role === UserRole.COADMIN ||
          targetUser.role === UserRole.ADMIN
        ) {
          throw new ForbiddenException(
            'COADMIN não pode gerenciar outros COADMIN ou ADMIN',
          );
        }
        return true;
      }

      // OPERATOR e USER não podem gerenciar outros usuários
      if (
        currentUser.role === UserRole.OPERATOR ||
        currentUser.role === UserRole.USER
      ) {
        // Só podem acessar próprio perfil
        if (targetUserId !== currentUser.id) {
          throw new ForbiddenException(
            'Você só pode gerenciar seu próprio perfil',
          );
        }
        return true;
      }
    }

    return false;
  }
}
