import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export async function seedInitialAdmin(dataSource: DataSource) {
  const userRepository = dataSource.getRepository('User');

  // Verificar se já existe algum usuário ADMIN
  const existingAdmin = await userRepository.findOne({
    where: { role: 'ADMIN' },
  });

  if (existingAdmin) {
    console.log('✅ Usuário ADMIN já existe. Seed cancelado.');
    return;
  }

  // Criar o primeiro usuário ADMIN
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = userRepository.create({
    email: 'admin@solar.com',
    name: 'Administrador do Sistema',
    password: hashedPassword,
    role: 'ADMIN',
    isActive: true,
    companyId: null, // ADMIN não pertence a nenhuma empresa
  });

  await userRepository.save(admin);

  console.log('✅ Usuário ADMIN criado com sucesso!');
  console.log('   Email: admin@solar.com');
  console.log('   Senha: Admin@123');
  console.log('   ⚠️  ALTERE A SENHA EM PRODUÇÃO!');
}
