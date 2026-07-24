# REFLUX Licenses Update

Discord **webhook-only** alerts (no Discord bot).

## Setup — two webhooks

### License alerts
```env
DISCORD_LICENSE_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### Releases (red, clean card)
```env
DISCORD_RELEASE_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

Release posts look like:

```
🚀 REFLUX Update

⚡ PRO  `1.0.23` → `1.0.24`
🌿 FREE  `1.0.15` → `1.0.16`

🛠️ What's fixed
Darker UI background all around for a deeper, cleaner look.
```

No extra fields, footer, links, or source lines — just versions + what's fixed.

Put `releaseNotes` in each app `package.json` so the ship script picks up the fix text.
