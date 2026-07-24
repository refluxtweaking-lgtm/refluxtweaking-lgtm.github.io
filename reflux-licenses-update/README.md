# REFLUX Licenses Update

Discord **webhook-only** license alerts (no Discord bot).

## Setup

1. Discord → Server Settings → Integrations → Webhooks → **New Webhook**
2. Name it e.g. `REFLUX Licenses Update`, pick a channel, **Copy Webhook URL**
3. Add to Vercel env (or `.env.local`) the **full** URL — it must look like:

```env
DISCORD_LICENSE_WEBHOOK_URL=https://discord.com/api/webhooks/1234567890123456789/AbCdEf...long-token...
```

   Not a channel name, not a short token alone. Length is usually **100+ characters**.
4. Redeploy the site

### Quick test (local)

```bash
# after: npx vercel env pull .env.webhook-pull --environment=production
node scripts/diagnose-license-webhook.js
node scripts/send-license-webhook-test.js "This is a test"
```

### Ops test (live)

`POST /api/reflux-licenses-update/test` with header `Authorization: Bearer <REFLUX_OPS_SECRET>` and optional JSON `{ "message": "This is a test" }`.

## What you get

| Event | When |
|--------|------|
| issued | License created at purchase |
| activated | First unlock on a PC |
| session | PRO opened with a valid license (max 1× / 12h per key+PC) |
| expired | License period ended |
| transferred | License moved to a new PC |
| test | Manual webhook connectivity check |
| deployed | New FREE/PRO version in `app-releases.json`, or installer/update emails sent |

Keys and emails are **masked** in Discord. The webhook URL never ships inside the desktop app.

## Security

- Discord alerts **do not unlock** licenses and never include full keys.
- Public `POST /api/reflux-licenses-update/event` requires a signed **app sync token** and only accepts `session` heartbeats.
- `issued` / `activated` / `expired` / `transferred` are fired **server-side only** (purchase + sync), never from an unauthenticated browser/Discord path.
- KeyAuth key lookup is **not** exposed on this endpoint (no key-oracle).

## Code

- Library: `src/lib/reflux-licenses-update/`
- API: `POST /api/reflux-licenses-update/event`
- Test: `POST /api/reflux-licenses-update/test`
- Ship share: `scripts/sync-app-releases.js` (Discord when FREE/PRO version changes)
- PRO reporter: `reflux-licenses-update/` in the PRO repo
