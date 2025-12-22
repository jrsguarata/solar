-- Script SQL para criar o primeiro usuário ADMIN manualmente
-- Execute este script apenas se não conseguir usar o seed do NestJS

-- IMPORTANTE: Este hash de senha corresponde a "Admin@123"
-- O hash foi gerado com bcrypt rounds=10
-- EM PRODUÇÃO, ALTERE A SENHA IMEDIATAMENTE APÓS O PRIMEIRO LOGIN!

INSERT INTO users (
  id,
  email,
  name,
  password,
  role,
  is_active,
  company_id,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@solar.com',
  'Administrador do Sistema',
  '$2b$10$rYvL5qH3qKqN1jXzJy9HZOz7xR1vK5Qw8yU7Xz9Hj5Lq3Nz7Xw8Yy', -- Admin@123
  'ADMIN',
  true,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verificar se foi criado
SELECT id, email, name, role, is_active, created_at
FROM users
WHERE email = 'admin@solar.com';
