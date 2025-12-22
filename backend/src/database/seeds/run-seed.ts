import { DataSource } from 'typeorm';
import { seedInitialAdmin } from './initial-admin.seed';
import { dataSource } from '../typeorm.config';

async function runSeeds() {
  try {
    console.log('🌱 Iniciando seeds...\n');

    // Conectar ao banco
    await dataSource.initialize();
    console.log('✅ Conectado ao banco de dados\n');

    // Executar seeds
    await seedInitialAdmin(dataSource);

    console.log('\n✅ Seeds executados com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seeds:', error);
    process.exit(1);
  }
}

runSeeds();
