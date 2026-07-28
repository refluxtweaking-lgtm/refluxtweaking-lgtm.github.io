# REFLUX Licenses Update

Discord **webhook-only** alerts (no Discord bot).

## Setup — two webhooks

### License alerts
```env
DISCORD_LICENSE_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### Releases (red card + custom emojis)
```env
DISCORD_RELEASE_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Custom server emojis (paste ID or full <:name:id> tag)
DISCORD_EMOJI_HAMMER1=<:hammer1:YOUR_ID>
DISCORD_EMOJI_STATUS=<:status:YOUR_ID>
DISCORD_EMOJI_REFLUX_PRO=<:RefluxPro:YOUR_ID>
DISCORD_EMOJI_REFLUX=<:Reflux:YOUR_ID>
```

How to get an emoji ID: Discord → Settings → Advanced → Developer Mode → right‑click the emoji → **Copy ID**.

Release posts look like:

```
📡 REFLUX Update 🛠️

📡 New build is live

⚡ PRO · `1.0.25` → `1.0.26`
🌿 FREE · _unchanged_

🛠️ What's fixed
Fixed Start Game opening a blank CMD window...
```

(With your custom emojis set, those unicode icons become `:status:` `:hammer1:` `:RefluxPro:` `:Reflux:`.)

Put `releaseNotes` in each app `package.json` so the ship script picks up the fix text.
