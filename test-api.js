const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Response is not JSON: ' + data));
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function test() {
  try {
    console.log('1. Fazendo login...');
    const loginData = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, JSON.stringify({ email: 'admin@solar.com', password: 'Admin@123' }));

    if (!loginData.accessToken) {
      console.error('Login falhou:', loginData);
      return;
    }

    console.log('✅ Login OK!');

    console.log('\n2. Buscando empresas...');
    const companies = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/companies',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${loginData.accessToken}` },
    });

    const emp01 = companies.find(c => c.code === 'EMP01');

    if (!emp01) {
      console.error('❌ EMP01 não encontrada!');
      return;
    }

    console.log('\n=== EMPRESA EMP01 ===');
    console.log('isActive:', emp01.isActive);
    console.log('deactivatedAt:', emp01.deactivatedAt);
    console.log('deactivatedBy:', emp01.deactivatedBy);
    console.log('deactivatedByUser:', JSON.stringify(emp01.deactivatedByUser, null, 2));

    if (emp01.deactivatedAt && emp01.deactivatedBy && emp01.deactivatedByUser) {
      console.log('\n✅✅✅ API RETORNA TODOS OS CAMPOS CORRETAMENTE!');
    } else {
      console.log('\n❌❌❌ CAMPOS FALTANDO:');
      if (!emp01.deactivatedAt) console.log('  - deactivatedAt');
      if (!emp01.deactivatedBy) console.log('  - deactivatedBy');
      if (!emp01.deactivatedByUser) console.log('  - deactivatedByUser');
    }
  } catch (error) {
    console.error('ERRO:', error.message);
  }
}

test();
