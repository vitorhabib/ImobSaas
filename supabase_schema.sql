-- 1. Tabela de Planos
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    max_users INTEGER NOT NULL,
    max_listings INTEGER NOT NULL,
    features TEXT[],
    price NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Organizações
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    person_type TEXT, -- 'INDIVIDUAL' | 'COMPANY'
    cpf TEXT,
    cnpj TEXT,
    phone TEXT,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Usuários (Profile)
-- Esta tabela se liga ao usuário de autenticação do Supabase (auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela de Membros (Vínculo entre Usuário e Organização)
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER')),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Triggers para atualizar o updated_at automaticamente (Opcional mas recomendado)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_plans_modtime BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_organizations_modtime BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_members_modtime BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_modified_column();
