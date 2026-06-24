import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { LEGAL_COMPANY, LEGAL_CONTACT_EMAIL, LEGAL_GOVERNING_COUNTRY, LEGAL_GOVERNING_STATE } from "@/data/legal";

export const metadata: Metadata = {
  title: "Disclaimer – REFLUX TWEAKS",
  description: "Disclaimer and limitation of liability for REFLUX TWEAKS products.",
};

export default function DisclaimerPage() {
  return (
    <LegalDocument title="Disclaimer">
      <section>
        <h2>General disclaimer</h2>
        <p>
          {LEGAL_COMPANY} provides REFLUX FREE, REFLUX PRO, and refluxtweaks.com for informational and optimization
          purposes. By using our products, you acknowledge and agree to the following.
        </p>
      </section>

      <section>
        <h2>No guarantee of results</h2>
        <p>
          Performance improvements (FPS, latency, ping, system responsiveness) vary based on your hardware, drivers,
          games, network, and Windows configuration. We do not guarantee specific results. Marketing examples,
          benchmarks, and testimonials represent typical or illustrative outcomes — not promises.
        </p>
      </section>

      <section>
        <h2>Use at your own risk</h2>
        <p>
          System optimization involves modifying registry keys, services, power settings, network configuration, and
          other Windows components. While we design tweaks to be reversible and include restore-point guidance, you use
          the Software entirely at your own risk. {LEGAL_COMPANY} is not responsible for:
        </p>
        <ul>
          <li>Data loss, system instability, boot issues, or software conflicts</li>
          <li>Hardware damage, overheating, or reduced hardware lifespan</li>
          <li>Game bans, anti-cheat flags, or third-party service disruptions</li>
          <li>Network outages, ISP issues, or routing changes</li>
          <li>Irreversible changes from debloat, app removal, or security-related tweaks</li>
        </ul>
      </section>

      <section>
        <h2>Administrator privileges</h2>
        <p>
          REFLUX software requires Windows Administrator privileges to apply system-level changes. Only run the Software
          on systems you own or are authorized to modify. Running as Administrator increases the impact of any error.
        </p>
      </section>

      <section>
        <h2>Third-party software and services</h2>
        <p>
          REFLUX interacts with Windows, game launchers, GPU drivers, and online services (authentication, licensing,
          payments). We are not responsible for third-party outages, policy changes, or compatibility issues.
        </p>
      </section>

      <section>
        <h2>Assumption of risk</h2>
        <p>
          By using REFLUX software you voluntarily assume all risks of system modification, including registry and
          service changes, debloat operations, network tuning, and power-plan changes. You confirm you understand these
          tools are powerful, may not be fully reversible, and are intended only for systems you own or may legally
          modify.
        </p>
      </section>

      <section>
        <h2>Anti-cheat and third-party services</h2>
        <p>
          {LEGAL_COMPANY} is not responsible for game bans, anti-cheat flags, VAC or EAC actions, launcher issues,
          driver conflicts, or policy changes by Microsoft, game publishers, GPU vendors, or payment processors. Use
          tweaks at your own discretion in competitive or online games.
        </p>
      </section>

      <section>
        <h2>Refunds</h2>
        <p>
          Digital licenses are generally non-refundable once delivered, except where required by law or at our sole
          discretion for verified technical issues we cannot resolve. Contact{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a> within 7 days of purchase for refund
          requests. Chargebacks without contacting support may result in license revocation.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, {LEGAL_COMPANY.toUpperCase()} AND ITS OWNERS, OPERATORS, EMPLOYEES,
          AND AFFILIATES SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY,
          OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OUR PRODUCTS OR WEBSITE. FOR PAID PRODUCTS, OUR TOTAL LIABILITY
          SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE PRECEDING TWELVE (12) MONTHS. REFLUX FREE IS PROVIDED AT NO
          CHARGE; IF YOU HAVE NOT PAID FOR A PRODUCT, WE HAVE NO MONETARY LIABILITY TO YOU. SOME JURISDICTIONS DO NOT
          ALLOW CERTAIN LIMITATIONS; IN THOSE CASES, LIABILITY IS LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
        </p>
      </section>

      <section>
        <h2>Disputes</h2>
        <p>
          Disputes are subject to our{" "}
          <a href="/terms">Terms of Service</a>, including binding individual arbitration and class action waiver where
          permitted by law. Contact{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a> before initiating any claim and allow 30
          days for informal resolution. Governing law: {LEGAL_GOVERNING_STATE}, {LEGAL_GOVERNING_COUNTRY}.
        </p>
      </section>

      <section>
        <h2>Professional advice</h2>
        <p>
          Nothing on our website or in our software constitutes professional IT, legal, or financial advice. Consult
          qualified professionals for critical systems or regulated environments.
        </p>
      </section>
    </LegalDocument>
  );
}
