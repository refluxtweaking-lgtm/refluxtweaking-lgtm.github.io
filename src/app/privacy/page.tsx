import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_COMPANY, LEGAL_CONTACT_EMAIL } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy – REFLUX TWEAKS",
  description: "How REFLUX TWEAKS collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy Policy">
      <section>
        <h2>1. Overview</h2>
        <p>
          {LEGAL_COMPANY} (&quot;we&quot;, &quot;us&quot;) operates refluxtweaks.com and the REFLUX desktop applications. This
          policy explains what information we collect, why we collect it, and how we handle it.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>
        <ul>
          <li>
            <strong>Account data:</strong> email address and authentication credentials when you create an account
          </li>
          <li>
            <strong>Purchase data:</strong> email, plan purchased, payment confirmation from our payment processor
            (we do not store full card numbers)
          </li>
          <li>
            <strong>License data:</strong> license keys, activation status, hardware ID (HWID) hash for one-device
            binding, activation timestamps, and access expiry dates
          </li>
          <li>
            <strong>Support communications:</strong> messages you send via email or Discord
          </li>
          <li>
            <strong>Technical data:</strong> basic server logs (IP address, browser type, request timestamps) for
            security and debugging
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <ul>
          <li>Deliver license keys and provide access to REFLUX PRO downloads</li>
          <li>Authenticate accounts and sync license status between the website and desktop app</li>
          <li>Prevent fraud, piracy, and license abuse</li>
          <li>Send purchase confirmations, license updates, and support responses</li>
          <li>Improve our products and maintain site security</li>
        </ul>
      </section>

      <section>
        <h2>4. Third-party services</h2>
        <p>We use trusted third parties to operate our business, including:</p>
        <ul>
          <li>Supabase (authentication and database hosting)</li>
          <li>Payment processors (checkout and billing)</li>
          <li>Resend (transactional email)</li>
          <li>KeyAuth (license key management)</li>
          <li>Vercel (website hosting)</li>
        </ul>
        <p>These providers process data according to their own privacy policies and our instructions.</p>
      </section>

      <section>
        <h2>5. Data retention</h2>
        <p>
          We retain account and license records as long as needed to provide services, comply with law, and resolve
          disputes. You may request account deletion by contacting us; some purchase records may be retained for
          legal and accounting purposes.
        </p>
      </section>

      <section>
        <h2>6. Security</h2>
        <p>
          We use industry-standard measures including encrypted connections, access controls, and signed download
          tokens. No method of transmission or storage is 100% secure; we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>7. Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct, or delete personal data. Contact{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a> to make a request. We will respond within
          a reasonable timeframe.
        </p>
      </section>

      <section>
        <h2>8. Children</h2>
        <p>Our services are not directed to children under 13. We do not knowingly collect data from children.</p>
      </section>

      <section>
        <h2>9. Changes</h2>
        <p>We may update this Privacy Policy. The &quot;Last updated&quot; date at the top reflects the current version.</p>
      </section>
    </LegalDocument>
  );
}
