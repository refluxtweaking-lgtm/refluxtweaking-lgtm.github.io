import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_COMPANY, LEGAL_CONTACT_EMAIL, LEGAL_GOVERNING_COUNTRY, LEGAL_GOVERNING_STATE } from "@/data/legal";

export const metadata: Metadata = {
  title: "End User License Agreement – REFLUX TWEAKS",
  description: "End User License Agreement (EULA) for REFLUX FREE and REFLUX PRO software.",
};

export default function EulaPage() {
  return (
    <LegalDocument title="End User License Agreement (EULA)">
      <section>
        <h2>IMPORTANT — READ CAREFULLY</h2>
        <p>
          This End User License Agreement (&quot;Agreement&quot;) is a legal contract between you (&quot;User&quot;) and{" "}
          {LEGAL_COMPANY} (&quot;Licensor&quot;) for REFLUX FREE and REFLUX PRO software (&quot;Software&quot;). By
          installing, copying, or using the Software, you accept this Agreement. If you do not accept it, do not install
          or use the Software.
        </p>
      </section>

      <section>
        <h2>1. Grant of license</h2>
        <p>
          Subject to your compliance with this Agreement, Licensor grants you a limited, non-exclusive,
          non-transferable, revocable license to install and use the Software on computers you own or control.
        </p>
        <ul>
          <li>
            <strong>REFLUX FREE:</strong> free personal use with feature limitations as described in the application
          </li>
          <li>
            <strong>REFLUX PRO:</strong> paid license required; one active device per license key after activation
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Restrictions</h2>
        <p>You may not:</p>
        <ul>
          <li>Copy, distribute, sell, sublicense, or publicly share the Software or license keys</li>
          <li>Modify, reverse engineer, decompile, or create derivative works except as permitted by law</li>
          <li>Remove or circumvent license verification, integrity checks, or download protection</li>
          <li>Use the Software to harm systems, networks, or third parties</li>
        </ul>
      </section>

      <section>
        <h2>3. System modifications</h2>
        <p>
          The Software applies system-level optimizations including registry edits, service configuration, network
          settings, and power plan changes. You acknowledge that:
        </p>
        <ul>
          <li>Results vary by hardware, software, and configuration</li>
          <li>Some changes may require administrator privileges</li>
          <li>You should create Windows restore points before applying tweaks</li>
          <li>Some changes may not be fully reversible; debloat and removal operations are especially difficult to undo</li>
        </ul>
      </section>

      <section>
        <h2>4. Ownership</h2>
        <p>
          The Software is licensed, not sold. Licensor retains all rights, title, and interest in the Software,
          including all intellectual property rights.
        </p>
      </section>

      <section>
        <h2>5. Updates</h2>
        <p>
          Licensor may provide updates, patches, or new versions. Updates may modify features or system behavior.
          Continued use after an update constitutes acceptance of the updated Software.
        </p>
      </section>

      <section>
        <h2>6. Termination</h2>
        <p>
          This license is effective until terminated. It terminates automatically if you breach this Agreement.
          Licensor may terminate paid licenses for fraud, chargebacks, or abuse. Upon termination, you must stop using
          the Software and uninstall it.
        </p>
      </section>

      <section>
        <h2>7. Disclaimer of warranties</h2>
        <p>
          THE SOFTWARE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT. LICENSOR DOES NOT WARRANT THAT THE SOFTWARE WILL BE ERROR-FREE, UNINTERRUPTED, OR THAT
          PERFORMANCE IMPROVEMENTS WILL OCCUR.
        </p>
      </section>

      <section>
        <h2>8. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, LICENSOR AND ITS OWNERS, OPERATORS, EMPLOYEES, AND
          AFFILIATES SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR
          PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS, REVENUE, HARDWARE, GOODWILL, OR BUSINESS INTERRUPTION ARISING
          FROM USE OF THE SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. LICENSOR&apos;S TOTAL LIABILITY
          FOR PAID SOFTWARE SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SOFTWARE IN THE TWELVE (12) MONTHS PRECEDING
          THE CLAIM. REFLUX FREE IS PROVIDED AT NO CHARGE; IF YOU HAVE NOT PAID FOR THE SOFTWARE, WE HAVE NO MONETARY
          LIABILITY TO YOU. SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; IN THOSE CASES, LIABILITY IS LIMITED
          TO THE MAXIMUM EXTENT PERMITTED BY LAW.
        </p>
      </section>

      <section>
        <h2>9. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless {LEGAL_COMPANY} and its owners, operators, employees, and
          affiliates from any claims, damages, losses, liabilities, costs, and expenses (including reasonable
          attorneys&apos; fees) arising from your use of the Software, your violation of this Agreement, your violation
          of any law or third-party right, or harm to systems you were not authorized to modify.
        </p>
      </section>

      <section>
        <h2>10. Dispute resolution and class action waiver</h2>
        <p>
          Before filing a claim, contact{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a> and allow at least 30 days to resolve the
          issue informally. Except where prohibited by law or for qualifying small claims court matters, disputes shall
          be resolved by binding individual arbitration under AAA Consumer Arbitration Rules.{" "}
          <strong>
            YOU AND LICENSOR WAIVE ANY RIGHT TO A JURY TRIAL AND TO PARTICIPATE IN A CLASS ACTION, COLLECTIVE ACTION,
            OR REPRESENTATIVE PROCEEDING.
          </strong>{" "}
          If arbitration does not apply, disputes shall be brought exclusively in courts in {LEGAL_GOVERNING_STATE},{" "}
          {LEGAL_GOVERNING_COUNTRY}. Non-waivable consumer rights in your country of residence still apply.
        </p>
      </section>

      <section>
        <h2>11. Governing law</h2>
        <p>
          This Agreement is governed by the laws of {LEGAL_GOVERNING_STATE}, {LEGAL_GOVERNING_COUNTRY}, without regard
          to conflict-of-law principles, except where mandatory consumer protection laws in your country of residence
          apply.
        </p>
      </section>

      <section>
        <h2>12. Severability</h2>
        <p>
          If any provision is held invalid, the remaining provisions remain in effect. This Agreement, our Terms of
          Service, Privacy Policy, and Disclaimer are the entire agreement between you and Licensor regarding the
          Software.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
        <p>
          {LEGAL_COMPANY} — <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
        </p>
      </section>
    </LegalDocument>
  );
}
