import { Resend } from "resend";
import { proDownloadUrl } from "@/data/downloads";

function planLabel(plan: string) {
  const value = plan.trim().toLowerCase();
  if (value === "monthly") return "REFLUX PRO Monthly";
  if (value === "yearly") return "REFLUX PRO Yearly";
  if (value === "lifetime") return "REFLUX PRO Lifetime";
  return `REFLUX PRO ${plan}`;
}

function buildHtml(plan: string, licenseKey: string, downloadUrl: string) {
  const label = planLabel(plan);
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#05070b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
      <div style="background:rgba(13,16,22,0.95);border:1px solid rgba(241,91,80,0.25);border-radius:16px;padding:32px;box-shadow:0 0 60px rgba(241,91,80,0.08);">
        <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;letter-spacing:0.04em;color:#f15b50;text-transform:uppercase;">REFLUX TWEAKS</h1>
        <div style="height:2px;width:64px;background:linear-gradient(90deg,rgba(241,91,80,0.6),rgba(241,91,80,0));margin:12px 0 24px;"></div>
        <p style="margin:0 0 16px;font-size:16px;color:#e7ecf2;">Thanks for upgrading to <strong style="color:#ffffff;">${label}</strong> — your license is ready.</p>
        <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.12em;color:#8b94a3;">Your license key</p>
        <div style="margin:0 0 24px;padding:18px;border-radius:12px;border:1px solid rgba(241,91,80,0.4);background:#05070b;text-align:center;">
          <code style="font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;font-size:20px;font-weight:700;letter-spacing:0.06em;color:#f15b50;word-break:break-all;">${licenseKey}</code>
        </div>
        <p style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:0.12em;color:#8b94a3;">Download REFLUX PRO</p>
        <div style="margin:0 0 24px;text-align:center;">
          <a href="${downloadUrl}" style="display:inline-block;padding:14px 28px;border-radius:12px;border:1px solid rgba(241,91,80,0.5);background:linear-gradient(135deg,rgba(241,91,80,0.25),rgba(241,91,80,0.12));color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.04em;">Download REFLUX PRO Installer</a>
        </div>
        <p style="margin:0 0 8px;font-size:14px;color:#c0c8d2;font-weight:600;">How to activate</p>
        <ol style="margin:0 0 24px;padding-left:20px;color:#a8b1bd;font-size:14px;line-height:1.7;">
          <li>Install and open <strong style="color:#e7ecf2;">REFLUX PRO</strong>.</li>
          <li>When prompted, paste your license key below.</li>
          <li>Your access countdown starts the day you activate.</li>
        </ol>
        <p style="margin:0;font-size:12px;color:#6b7280;">You can always find your keys by logging in at refluxtweaks.com. Keep this key private.</p>
      </div>
    </div>
  </body>
</html>`;
}

function buildText(plan: string, licenseKey: string, downloadUrl: string) {
  const label = planLabel(plan);
  return [
    `REFLUX TWEAKS`,
    ``,
    `Thanks for upgrading to ${label} — your license is ready.`,
    ``,
    `Your license key: ${licenseKey}`,
    ``,
    `Download REFLUX PRO: ${downloadUrl}`,
    ``,
    `How to activate:`,
    `1. Install and open REFLUX PRO.`,
    `2. When prompted, paste your license key.`,
    `3. Your access countdown starts the day you activate.`,
    ``,
    `You can always find your keys by logging in at refluxtweaks.com. Keep this key private.`,
  ].join("\n");
}

/**
 * Sends the license key email via Resend. Degrades gracefully: returns false
 * (and warns) when Resend env vars are missing or sending fails.
 */
export async function sendLicenseEmail(
  to: string,
  plan: string,
  licenseKey: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    console.warn("[email] Resend not configured — skipping license email delivery.");
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const downloadUrl = proDownloadUrl();
    const { error } = await resend.emails.send({
      from,
      to,
      subject: "Your REFLUX PRO license key & download",
      html: buildHtml(plan, licenseKey, downloadUrl),
      text: buildText(plan, licenseKey, downloadUrl),
    });

    if (error) {
      console.error("[email] Resend send failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Resend send threw:", err);
    return false;
  }
}
