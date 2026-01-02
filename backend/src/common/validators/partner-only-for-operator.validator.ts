import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { UserRole } from '../../modules/users/entities/user.entity';

export function IsPartnerOnlyForOperator(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPartnerOnlyForOperator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const role = obj.role;
          const partnerId = value;

          // Se partnerId está preenchido, role DEVE ser OPERATOR
          if (partnerId && role !== UserRole.OPERATOR) {
            return false;
          }

          // Se role é OPERATOR, partnerId PODE ou NÃO estar preenchido (é opcional)
          // Qualquer outro caso é válido
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'O campo partnerId só pode ser preenchido para usuários com perfil OPERATOR';
        },
      },
    });
  };
}
