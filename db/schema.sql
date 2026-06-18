-- Talkential — multi-tenant Postgres schema (Supabase compatible)
-- Run this once in your Supabase SQL editor (or `psql -f schema.sql`).

create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- ─────────────────────────────────────────────────────────────
-- TENANTS  (one row per paying business)
-- ─────────────────────────────────────────────────────────────
create table if not exists tenants (
  id              uuid primary key default uuid_generate_v4(),
  business_name   text not null,
  industry        text not null check (industry in ('real_estate','ecommerce','healthcare')),
  plan            text not null default 'starter' check (plan in ('starter','growth','pro','enterprise')),
  phone_number_id text unique,                  -- WhatsApp phone_number_id (Meta)
  phone_number    text,                         -- display number
  whatsapp_token  text,                         -- access token (store encrypted in prod)
  ai_persona_name text default 'Assistant',
  ai_tone         text default 'friendly' check (ai_tone in ('formal','friendly','casual')),
  language        text default 'mixed' check (language in ('english','urdu','roman_urdu','mixed')),
  system_prompt   text,                         -- custom prompt override
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- TENANT USERS  (business owner + their team)
-- ─────────────────────────────────────────────────────────────
create table if not exists tenant_users (
  id          uuid primary key default uuid_generate_v4(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  auth_user_id uuid unique,                     -- maps to auth.users(id)
  email       text not null,
  full_name   text,
  role        text not null default 'owner' check (role in ('owner','agent','viewer')),
  created_at  timestamptz not null default now()
);
create index if not exists idx_tenant_users_tenant on tenant_users(tenant_id);

-- ─────────────────────────────────────────────────────────────
-- TENANT CONFIG  (flexible key/value per tenant)
-- ─────────────────────────────────────────────────────────────
create table if not exists tenant_config (
  tenant_id  uuid not null references tenants(id) on delete cascade,
  key        text not null,
  value      jsonb not null,
  primary key (tenant_id, key)
);

-- ─────────────────────────────────────────────────────────────
-- DOCUMENTS  (knowledge base for RAG)
-- ─────────────────────────────────────────────────────────────
create table if not exists documents (
  id         uuid primary key default uuid_generate_v4(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  source     text,                              -- url / filename / 'manual'
  content    text not null,
  embedding  vector(1536),
  metadata   jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_documents_tenant on documents(tenant_id);

-- ─────────────────────────────────────────────────────────────
-- CUSTOMERS  (end users on WhatsApp — leads come from here)
-- ─────────────────────────────────────────────────────────────
create table if not exists customers (
  id         uuid primary key default uuid_generate_v4(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  phone      text not null,
  name       text,
  city       text,
  metadata   jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, phone)
);
create index if not exists idx_customers_tenant on customers(tenant_id);

-- ─────────────────────────────────────────────────────────────
-- LEADS  (qualified prospects extracted from conversations)
-- ─────────────────────────────────────────────────────────────
create table if not exists leads (
  id              uuid primary key default uuid_generate_v4(),
  tenant_id       uuid not null references tenants(id) on delete cascade,
  customer_id     uuid not null references customers(id) on delete cascade,
  status          text not null default 'new'
                  check (status in ('new','qualifying','hot','warm','cold','won','lost')),
  hot_score       int  not null default 0 check (hot_score between 0 and 100),
  source          text,                          -- 'facebook_ad','olx','referral', ...
  extracted_data  jsonb not null default '{}'::jsonb,
  assigned_to     uuid references tenant_users(id) on delete set null,
  last_message_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_leads_tenant_status on leads(tenant_id, status);
create index if not exists idx_leads_tenant_last_msg on leads(tenant_id, last_message_at desc);

-- ─────────────────────────────────────────────────────────────
-- CONVERSATIONS  (full message history)
-- ─────────────────────────────────────────────────────────────
create table if not exists conversations (
  id          uuid primary key default uuid_generate_v4(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  role        text not null check (role in ('user','assistant','system')),
  message     text not null,
  metadata    jsonb default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists idx_conv_tenant_customer on conversations(tenant_id, customer_id, created_at);

-- ─────────────────────────────────────────────────────────────
-- INDUSTRY TEMPLATES  (system prompts + required fields per vertical)
-- ─────────────────────────────────────────────────────────────
create table if not exists industry_templates (
  id              uuid primary key default uuid_generate_v4(),
  industry        text not null unique,
  display_name    text not null,
  system_prompt   text not null,
  required_fields jsonb not null default '[]'::jsonb,   -- e.g. ["budget","area","bedrooms"]
  created_at      timestamptz not null default now()
);

-- Seed the 3 launch verticals
insert into industry_templates (industry, display_name, system_prompt, required_fields) values
('real_estate',
 'Real Estate',
 'You are a friendly real estate sales assistant. Ask qualifying questions: budget, area/location, bedrooms, buy or rent, timeline. Be concise. Reply in the same language the user uses.',
 '["budget","area","bedrooms","purpose","timeline"]'::jsonb),
('ecommerce',
 'E-commerce',
 'You are a helpful online store assistant. Help customers with product info, sizes, availability, and place orders. Ask for: product, variant, quantity, address. Reply in the same language the user uses.',
 '["product","variant","quantity","address"]'::jsonb),
('healthcare',
 'Healthcare',
 'You are a polite clinic assistant. Help patients book appointments and answer service questions. Ask for: service, preferred date, contact name. Include a medical disclaimer when advising. Reply in the same language the user uses.',
 '["service","preferred_date","name"]'::jsonb)
on conflict (industry) do nothing;
