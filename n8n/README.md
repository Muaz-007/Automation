# n8n workflow engine

Local n8n instance for Talkential automation flows — Slack/Telegram alerts, CRM sync, drip campaigns, scheduled reports.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running

Check Docker is alive:

```bash
docker --version
docker ps
```

## Start n8n

From the project root:

```bash
cd n8n
docker compose up -d
```

This pulls the `n8nio/n8n:latest` image and starts a container on port `5678`. Workflows and credentials persist in a Docker volume (`whatsapp-automate-n8n-data`), so they survive `docker compose down`.

Then open: **http://localhost:5678**

On first launch n8n asks you to create an owner account (name, email, password). That account is local to this Docker volume — has nothing to do with the Supabase auth in the dashboard.

## Useful commands

| Command | What it does |
|---|---|
| `docker compose up -d` | Start n8n in the background |
| `docker compose down` | Stop the container (workflows preserved) |
| `docker compose logs -f n8n` | Tail logs |
| `docker compose restart n8n` | Restart after env changes |
| `docker compose pull && docker compose up -d` | Upgrade to latest n8n release |

To completely reset n8n (lose all workflows):

```bash
docker compose down -v
```

## How Talkential sends events to n8n

The Next.js dashboard fires HTTP POST requests to n8n's "Webhook" trigger nodes whenever something interesting happens — a new lead, a hot lead, a handoff request, etc.

You build workflows in n8n that catch these events and act on them (Slack message, email, Sheet append, drip campaign, etc.).

| Event type | When it fires | Payload |
|---|---|---|
| `lead.created` | A new customer messages your WhatsApp for the first time | `{ tenant_id, lead_id, customer: {phone, name, city}, source }` |
| `lead.hot` | An existing lead crosses the "hot" threshold (status=hot or hot_score≥75) | Same + `{ hot_score, extracted_data }` |
| `lead.handoff` | AI sets `handoff_to_human=true` — needs your owner's attention | Same + `{ last_message, reason }` |

The dashboard reads the n8n webhook URL from `N8N_WEBHOOK_URL` in `dashboard/.env.local`. For local dev:

```
N8N_WEBHOOK_URL=http://localhost:5678/webhook/whatsapp-automate
```

## Building your first workflow

1. Open n8n at http://localhost:5678
2. Click **"New workflow"**
3. Add a **Webhook** trigger node:
   - **HTTP Method**: `POST`
   - **Path**: `whatsapp-automate`
   - **Authentication**: None (for local dev)
4. Add the action you want next — e.g. **Slack** → "Send Message"
5. Click **"Activate"** in the top-right (toggle to green)
6. Copy the **"Test URL"** OR **"Production URL"** from the Webhook node

Production URL will look like: `http://localhost:5678/webhook/whatsapp-automate`

Paste this into `dashboard/.env.local` as `N8N_WEBHOOK_URL`, then restart your Next.js dev server.

Done — every lead event from the dashboard will now flow through this workflow.

## Production deployment

For production (VPS), use the same `docker-compose.yml` but:

1. Replace `WEBHOOK_URL=http://localhost:5678/` with your public HTTPS domain (e.g. `https://n8n.yourdomain.com/`)
2. Set `N8N_PROTOCOL=https`
3. Generate a strong `N8N_ENCRYPTION_KEY` and store as a real secret
4. Add a reverse proxy (Caddy / Nginx) in front for SSL termination
5. Optional: use external Postgres instead of SQLite (set `DB_TYPE=postgresdb` env vars)

See the official guide: https://docs.n8n.io/hosting/installation/server-setups/docker-compose/
