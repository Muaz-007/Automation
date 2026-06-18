-- Talkential — baseline Row Level Security policy
--
-- Why this exists:
--   Supabase auto-exposes every `public` table via the PostgREST REST API.
--   That means anyone with the publishable (anon) key can hit
--     GET /rest/v1/<table>?select=*
--   and read the entire table unless RLS is enabled.
--
-- What this does:
--   Enables RLS on every public-schema table. With zero policies attached,
--   ALL access through PostgREST (anon + authenticated roles) is denied.
--
-- Why this is safe for our app:
--   The dashboard talks to Postgres through Prisma using the connection-pool
--   credentials in DATABASE_URL. Prisma's role is the `postgres` superuser,
--   which BYPASSES row level security. So Prisma queries keep working
--   unchanged — only the PostgREST/anon-key path is blocked.
--
-- When to add policies:
--   The day we ship a feature that calls Supabase directly from the browser
--   (e.g. real-time subscriptions on `conversations`), add a tenant-scoped
--   policy for just that table. Keep everything else closed by default.
--
-- How to run:
--   Paste this entire file into Supabase SQL Editor (Database → SQL Editor →
--   New query) and click Run. It is idempotent — safe to re-run.

alter table public.tenants            enable row level security;
alter table public.tenant_users       enable row level security;
alter table public.tenant_config      enable row level security;
alter table public.documents          enable row level security;
alter table public.customers          enable row level security;
alter table public.leads              enable row level security;
alter table public.conversations      enable row level security;
alter table public.inventory_items    enable row level security;
alter table public.industry_templates enable row level security;
