# REFLUX Licenses Update

Discord **webhook-only** license alerts (no Discord bot).

## Setup

1. Discord → Server Settings → Integrations → Webhooks → **New Webhook**
2. Name it e.g. `REFLUX Licenses Update`, pick a channel, **Copy Webhook URL**
3. Add to Vercel env (or `.env.local`):

```env
DISCORD_LICENSE_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN
```

4. Redeploy the site

## What you get

| Event | When |
|--------|------|
| issued | License created at purchase |
| activated | First unlock on a PC |
| session | PRO opened with a valid license (max 1× / 12h per key+PC) |
| expired | License period ended |
| transferred | License moved to a new PC |

Keys and emails are **masked** in Discord. The webhook URL never ships inside the desktop app.

## Code

- Library: `src/lib/reflux-licenses-update/`
- API: `POST /api/reflux-licenses-update/event`
- PRO reporter: `reflux-licenses-update/` in the PRO repo
