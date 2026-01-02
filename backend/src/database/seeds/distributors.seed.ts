import { DataSource } from 'typeorm';

export async function seedDistributors(dataSource: DataSource) {
  console.log('📋 Populando tabela de distribuidoras...');

  const distributors = [
    // São Paulo
    { code: 'CPFL', name: 'CPFL Paulista', uf: 'SP', type: 'DISTRIBUIDOR' },
    { code: 'ENEL-SP', name: 'Enel Distribuição São Paulo', uf: 'SP', type: 'DISTRIBUIDOR' },
    { code: 'ELEKTRO', name: 'Elektro', uf: 'SP', type: 'DISTRIBUIDOR' },
    { code: 'EDP-SP', name: 'EDP São Paulo', uf: 'SP', type: 'DISTRIBUIDOR' },

    // Rio de Janeiro
    { code: 'LIGHT', name: 'Light SESA', uf: 'RJ', type: 'DISTRIBUIDOR' },
    { code: 'ENEL-RJ', name: 'Enel Distribuição Rio', uf: 'RJ', type: 'DISTRIBUIDOR' },

    // Minas Gerais
    { code: 'CEMIG', name: 'CEMIG Distribuição', uf: 'MG', type: 'DISTRIBUIDOR' },

    // Rio Grande do Sul
    { code: 'RGE', name: 'RGE Sul', uf: 'RS', type: 'DISTRIBUIDOR' },
    { code: 'CEEE', name: 'CEEE-D', uf: 'RS', type: 'DISTRIBUIDOR' },

    // Paraná
    { code: 'COPEL', name: 'Copel Distribuição', uf: 'PR', type: 'DISTRIBUIDOR' },

    // Santa Catarina
    { code: 'CELESC', name: 'Celesc Distribuição', uf: 'SC', type: 'DISTRIBUIDOR' },

    // Bahia
    { code: 'COELBA', name: 'Coelba', uf: 'BA', type: 'DISTRIBUIDOR' },

    // Pernambuco
    { code: 'CELPE', name: 'Celpe', uf: 'PE', type: 'DISTRIBUIDOR' },

    // Ceará
    { code: 'ENEL-CE', name: 'Enel Distribuição Ceará', uf: 'CE', type: 'DISTRIBUIDOR' },

    // Distrito Federal e Goiás
    { code: 'CEB', name: 'CEB Distribuição', uf: 'DF', type: 'DISTRIBUIDOR' },
    { code: 'ENEL-GO', name: 'Enel Distribuição Goiás', uf: 'GO', type: 'DISTRIBUIDOR' },

    // Espírito Santo
    { code: 'EDP-ES', name: 'EDP Espírito Santo', uf: 'ES', type: 'DISTRIBUIDOR' },

    // Amazonas
    { code: 'AMAZONAS', name: 'Amazonas Energia', uf: 'AM', type: 'DISTRIBUIDOR' },

    // Pará
    { code: 'EQUATORIAL-PA', name: 'Equatorial Pará', uf: 'PA', type: 'DISTRIBUIDOR' },

    // Maranhão
    { code: 'EQUATORIAL-MA', name: 'Equatorial Maranhão', uf: 'MA', type: 'DISTRIBUIDOR' },

    // Piauí
    { code: 'EQUATORIAL-PI', name: 'Equatorial Piauí', uf: 'PI', type: 'DISTRIBUIDOR' },

    // Alagoas
    { code: 'EQUATORIAL-AL', name: 'Equatorial Alagoas', uf: 'AL', type: 'DISTRIBUIDOR' },

    // Mato Grosso
    { code: 'ENERGISA-MT', name: 'Energisa Mato Grosso', uf: 'MT', type: 'DISTRIBUIDOR' },

    // Mato Grosso do Sul
    { code: 'ENERGISA-MS', name: 'Energisa Mato Grosso do Sul', uf: 'MS', type: 'DISTRIBUIDOR' },

    // Sergipe
    { code: 'ENERGISA-SE', name: 'Energisa Sergipe', uf: 'SE', type: 'DISTRIBUIDOR' },

    // Paraíba
    { code: 'ENERGISA-PB', name: 'Energisa Paraíba', uf: 'PB', type: 'DISTRIBUIDOR' },

    // Tocantins
    { code: 'ENERGISA-TO', name: 'Energisa Tocantins', uf: 'TO', type: 'DISTRIBUIDOR' },

    // Rondônia
    { code: 'ENERGISA-RO', name: 'Energisa Rondônia', uf: 'RO', type: 'DISTRIBUIDOR' },

    // Acre
    { code: 'ENERGISA-AC', name: 'Energisa Acre', uf: 'AC', type: 'DISTRIBUIDOR' },
  ];

  try {
    for (const distributor of distributors) {
      // Verificar se já existe (para evitar duplicatas)
      const existing = await dataSource.query(
        'SELECT id FROM distributors WHERE code = $1',
        [distributor.code]
      );

      if (existing.length === 0) {
        await dataSource.query(
          'INSERT INTO distributors (id, code, name, uf, type) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
          [distributor.code, distributor.name, distributor.uf, distributor.type]
        );
        console.log(`  ✅ ${distributor.code} - ${distributor.name}`);
      } else {
        console.log(`  ⏭️  ${distributor.code} - ${distributor.name} (já existe)`);
      }
    }

    console.log(`\n✅ ${distributors.length} distribuidoras processadas!\n`);
  } catch (error) {
    console.error('❌ Erro ao popular distribuidoras:', error);
    throw error;
  }
}
