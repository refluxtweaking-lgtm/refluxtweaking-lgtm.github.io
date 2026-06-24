import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_COMPANY, LEGAL_CONTACT_EMAIL, LEGAL_GOVERNING_COUNTRY, LEGAL_GOVERNING_STATE } from "@/data/legal";

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
          use REFLUX PRO ends. Sections regarding liability, disclaimers, indemnification, dispute resolution, and
          governing law survive termination.
        </p>
      </section>

      <section>
        <h2>8. Assumption of risk</h2>
        <p>
          You acknowledge that system optimization software modifies Windows configuration and requires Administrator
          privileges. You voluntarily assume all risks of data loss, system instability, hardware stress, game or
          anti-cheat actions, network changes, and any other harm from using our products. You are solely responsible
          for backups, restore points, and verifying changes on systems you own or are authorized to modify.
        </p>
      </section>

      <section>
        <h2>9. Disclaimer of warranties</h2>
        <p>
          OUR PRODUCTS AND WEBSITE ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY
          KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT UNINTERRUPTED OPERATION, ERROR-FREE SOFTWARE, SPECIFIC
          PERFORMANCE GAINS, OR COMPATIBILITY WITH YOUR HARDWARE, GAMES, OR THIRD-PARTY SOFTWARE.
        </p>
      </section>

      <section>
        <h2>10. Limitation of liability</h2>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, {LEGAL_COMPANY.toUpperCase()} AND ITS OWNERS, OPERATORS, EMPLOYEES,
          AND AFFILIATES SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR
          PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS, REVENUE, HARDWARE, GOODWILL, OR BUSINESS INTERRUPTION,
          ARISING FROM YOUR USE OF OUR PRODUCTS OR WEBSITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH
          DAMAGES. FOR PAID PRODUCTS, OUR TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE
          TWELVE (12) MONTHS BEFORE THE CLAIM. REFLUX FREE IS PROVIDED AT NO CHARGE; IF YOU HAVE NOT PAID FOR A
          PRODUCT, WE HAVE NO MONETARY LIABILITY TO YOU. SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; IN THOSE
          CASES, OUR LIABILITY IS LIMITED TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW.
        </p>
      </section>

      <section>
        <h2>11. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless {LEGAL_COMPANY} and its owners, operators, employees, and
          affiliates from any claims, damages, losses, liabilities, costs, and expenses (including reasonable
          attorneys&apos; fees) arising from your use of our products, your violation of these Terms, your violation of
          any law or third-party right, or any harm caused to systems you were not authorized to modify.
        </p>
      </section>

      <section>
        <h2>12. Dispute resolution and class action waiver</h2>
        <p>
          Before filing a claim, contact us at{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a> and allow at least 30 days to resolve
          the issue informally. Except where prohibited by law or for qualifying matters in small claims court, any
          dispute arising from these Terms or our products shall be resolved by binding individual arbitration
          administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, in English,
          with one arbitrator. The arbitration shall take place in {LEGAL_GOVERNING_STATE},{" "}
          {LEGAL_GOVERNING_COUNTRY}, or remotely by mutual agreement.{" "}
          <strong>
            YOU AND {LEGAL_COMPANY.toUpperCase()} WAIVE ANY RIGHT TO A JURY TRIAL AND TO PARTICIPATE IN A CLASS ACTION,
            COLLECTIVE ACTION, OR REPRESENTATIVE PROCEEDING.
          </strong>{" "}
          If arbitration is unenforceable for a particular claim, disputes shall be brought exclusively in the state or
          federal courts located in {LEGAL_GOVERNING_STATE}, {LEGAL_GOVERNING_COUNTRY}, and you consent to personal
          jurisdiction there. Nothing in this section limits non-waivable consumer rights where you live.
        </p>
      </section>

      <section>
        <h2>13. Governing law</h2>
        <p>
          These Terms are governed by the laws of {LEGAL_GOVERNING_STATE}, {LEGAL_GOVERNING_COUNTRY}, without regard to
          conflict-of-law rules, except where mandatory consumer protection laws in your country of residence apply.
        </p>
      </section>

      <section>
        <h2>14. Severability and entire agreement</h2>
        <p>
          If any provision of these Terms is held invalid or unenforceable, the remaining provisions remain in full
          force. These Terms, together with our Privacy Policy, EULA, and Disclaimer, constitute the entire agreement
          between you and {LEGAL_COMPANY} regarding our products and supersede prior understandings on the same
          subject.
        </p>
      </section>

      <section>
        <h2>15. Changes</h2>
        <p>
          We may update these Terms at any time. Material changes will be posted on this page with an updated date.
          Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>16. Contact</h2>
        <p>
          {LEGAL_COMPANY} — <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
        </p>
      </section>
    </LegalDocument>
  );
}
