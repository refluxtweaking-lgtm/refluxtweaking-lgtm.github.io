import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_COMPANY, LEGAL_CONTACT_EMAIL } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms of Service – REFLUX TWEAKS",
  description: "Terms of Service for REFLUX TWEAKS desktop software and refluxtweaks.com.",
};

export default function TermsPage() {
  return (
    <LegalDocument title="Terms of Service">
      <section>
        <h2>1. Agreement</h2>
        <p>
          By downloading, installing, purchasing, or using {LEGAL_COMPANY} software (REFLUX FREE, REFLUX PRO) or
          visiting refluxtweaks.com, you agree to these Terms of Service, our Privacy Policy, End User License
          Agreement, and Disclaimer. If you do not agree, do not use our products or services.
        </p>
      </section>

      <section>
        <h2>2. Products and licenses</h2>
        <p>
          REFLUX FREE is provided at no charge with limited features. REFLUX PRO requires a paid license (Monthly,
          Yearly, or Lifetime). Each REFLUX PRO license is bound to one computer via hardware identification after
          first activation. Licenses are personal, non-transferable, and may not be shared, resold, or redistributed.
        </p>
        <p>
          We may suspend or revoke access for fraud, chargebacks, license sharing, reverse engineering, or violation
          of these terms.
        </p>
      </section>

      <section>
        <h2>3. Payments and subscriptions</h2>
        <p>
          Payments are processed by third-party providers. Monthly and Yearly plans provide access for the stated
          billing period. Lifetime plans provide ongoing access to REFLUX PRO for the life of the product, subject to
          these terms.
        </p>
        <p>
          To cancel a Monthly subscription, contact us at{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a> before your next billing date. Access
          continues until the end of the paid period. Refund eligibility is described in our Disclaimer and handled
          case-by-case at our discretion unless required by applicable law.
        </p>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Pirate, crack, or bypass REFLUX PRO licensing or download protection</li>
          <li>Redistribute installers, license keys, or paid features</li>
          <li>Use our software for unlawful purposes or on systems you do not own or lack permission to modify</li>
          <li>Reverse engineer, decompile, or attempt to extract source code except where law expressly permits</li>
        </ul>
      </section>

      <section>
        <h2>5. System changes</h2>
        <p>
          REFLUX software modifies Windows system settings, registry entries, services, and power plans to optimize
          performance. You are responsible for creating backups and restore points before applying tweaks. Use at your
          own risk.
        </p>
      </section>

      <section>
        <h2>6. Intellectual property</h2>
        <p>
          All software, branding, website content, and materials are owned by {LEGAL_COMPANY} or its licensors. Your
          purchase grants a limited license to use the software — not ownership of the software itself.
        </p>
      </section>

      <section>
        <h2>7. Termination</h2>
        <p>
          We may terminate or suspend access at any time for violations of these terms. Upon termination, your right to
          use REFLUX PRO ends. Sections regarding liability, disclaimers, and governing law survive termination.
        </p>
      </section>

      <section>
        <h2>8. Changes</h2>
        <p>
          We may update these Terms at any time. Material changes will be posted on this page with an updated date.
          Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          {LEGAL_COMPANY} — <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
        </p>
      </section>
    </LegalDocument>
  );
}
