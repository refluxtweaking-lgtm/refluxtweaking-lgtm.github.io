# REFLUX Licenses Update

Discord **webhook-only** alerts (no Discord bot).

## Setup — two webhooks (recommended)

### 1) License alerts (existing)
Discord → Integrations → Webhooks → copy URL → Vercel:

```env
DISCORD_LICENSE_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### 2) Releases (new, red card)
Make a **second** webhook (same or different channel) → Vercel:

```env
DISCORD_RELEASE_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

Redeploy after adding. Release posts are **red** and show:

- **PRO** `old → new`
- **FREE** `old → new`

If `DISCORD_RELEASE_WEBHOOK_URL` is missing, release posts fall back to the license webhook.

### Quick test (licenses)

```bash
node scripts/send-license-webhook-test.js "This is a test"
```

Ops: `POST /api/reflux-licenses-update/test` with `Authorization: Bearer <REFLUX_OPS_SECRET>`.

## What you get

| Event | Channel | When |
|--------|---------|------|
| issued / activated / session / expired / transferred | license webhook | license lifecycle |
| test | license webhook | manual connectivity check |
| deployed | **red release webhook** | new FREE/PRO versions or update emails |

Keys/emails stay masked on the license channel. Webhook URLs never ship in the desktop app.

## Code

- Library: `src/lib/reflux-licenses-update/`
- Ship share: `scripts/sync-app-releases.js`
- PRO reporter: `reflux-licenses-update/` in the PRO repo
