import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout, H2, P, UL } from "@/components/landing/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service — WhatsappAutomate",
  description:
    "The agreement between WhatsappAutomate and the businesses that use our WhatsApp automation platform.",
};

const COMPANY_NAME = "WhatsappAutomate";
const CONTACT_EMAIL = "muaz.developments@gmail.com";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" effectiveDate="June 15, 2026">
      <P>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of {COMPANY_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
        &ldquo;our&rdquo;), a WhatsApp automation platform for businesses. By
        creating an account or using the Service, you agree to be bound by
        these Terms.
      </P>

      <H2>1. Who can use the Service</H2>
      <UL>
        <li>You must be at least 18 years old and legally able to enter into a contract.</li>
        <li>You must be acting on behalf of a real, lawfully operating business.</li>
        <li>
          You must comply with WhatsApp&apos;s{" "}
          <a
            href="https://www.whatsapp.com/legal/business-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Business Policy
          </a>{" "}
          and{" "}
          <a
            href="https://www.whatsapp.com/legal/commerce-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Commerce Policy
          </a>
          .
        </li>
      </UL>

      <H2>2. Your account</H2>
      <P>
        You are responsible for keeping your login credentials secure, for any
        activity on your account, and for ensuring the WhatsApp credentials you
        provide belong to a business you own or are authorized to manage.
      </P>

      <H2>3. Acceptable use</H2>
      <P>You agree not to use the Service to:</P>
      <UL>
        <li>Send unsolicited, deceptive, or harassing messages.</li>
        <li>Violate WhatsApp&apos;s policies, terms, or messaging guidelines.</li>
        <li>Send messages that violate any applicable law, including data-protection, anti-spam, or consumer-protection laws.</li>
        <li>Impersonate any person or entity, or misrepresent your affiliation.</li>
        <li>Distribute malware, run security probes, or interfere with the Service&apos;s normal operation.</li>
        <li>Resell, sublicense, or white-label the Service without our written agreement.</li>
        <li>Use the Service to handle sensitive personal data (health, financial, biometric) without taking appropriate additional safeguards.</li>
      </UL>
      <P>
        We may suspend or terminate any account that violates these rules. In
        serious cases we may also notify the relevant authorities or platforms
        (including Meta).
      </P>

      <H2>4. AI-generated content</H2>
      <P>
        The Service uses third-party AI models (currently Google Gemini) to
        generate replies and extract structured data from customer
        conversations. AI output:
      </P>
      <UL>
        <li>May contain inaccuracies, omissions, or unintended phrasing.</li>
        <li>
          Must be reviewed by you before being used for any decision with
          legal, financial, or medical consequences.
        </li>
        <li>
          Should not be treated as professional advice. You are responsible for
          the messages your AI assistant sends on your behalf.
        </li>
      </UL>

      <H2>5. Customer messages and end-user consent</H2>
      <P>
        You are responsible for obtaining any consent required by law before
        messaging your customers, and for honoring opt-out requests promptly.
        You represent that all phone numbers you message have an established
        relationship with you that permits automated messaging.
      </P>

      <H2>6. Plans, billing, and refunds</H2>
      <UL>
        <li>The Service is offered on monthly subscription plans. Pricing is published on our website and may change with notice.</li>
        <li>Fees are charged in advance and are non-refundable except where required by law.</li>
        <li>WhatsApp messaging charges are billed directly by Meta to your Meta Business account and are not part of our subscription fees.</li>
        <li>You may cancel at any time; your subscription will end at the close of the current billing period.</li>
      </UL>

      <H2>7. Intellectual property</H2>
      <P>
        We own the Service, including the software, design, and brand. You own
        the content you upload (business info, custom prompts, inventory) and
        the conversation data with your customers. You grant us a limited
        license to use that content solely to provide the Service to you.
      </P>

      <H2>8. Data processing</H2>
      <P>
        Our use of your data is described in the{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        . When you provide WhatsApp credentials, you authorize us to use them
        on your behalf to receive and send messages through the WhatsApp Cloud
        API.
      </P>

      <H2>9. Third-party platforms</H2>
      <P>
        The Service connects to platforms we do not control, including Meta
        WhatsApp, Google Gemini, and Supabase. Their availability, pricing,
        and policies are outside our control. Changes by those providers may
        affect the Service, and we will not be liable for resulting
        disruptions.
      </P>

      <H2>10. Termination</H2>
      <P>
        You may delete your account at any time from Settings. We may suspend
        or terminate your access for material breach of these Terms, abusive
        behavior, non-payment, or risk to the platform&apos;s integrity. On
        termination, your data is deleted as described in our Privacy Policy.
      </P>

      <H2>11. Disclaimers</H2>
      <P>
        The Service is provided &ldquo;as is&rdquo; without warranties of any
        kind, express or implied. We do not warrant that the Service will be
        uninterrupted, error-free, or fit for any particular purpose. To the
        maximum extent permitted by law, our aggregate liability to you for
        any claim arising out of the Service is limited to the amounts you
        paid us in the 12 months preceding the claim.
      </P>

      <H2>12. Indemnity</H2>
      <P>
        You agree to indemnify and hold us harmless from any claim, loss, or
        expense arising out of your misuse of the Service, your violation of
        these Terms, or your messages to end customers.
      </P>

      <H2>13. Governing law and disputes</H2>
      <P>
        These Terms are governed by the laws of the Islamic Republic of
        Pakistan, the jurisdiction in which the Service is operated. Any
        dispute will be resolved in the courts of Lahore, Pakistan, unless
        the local consumer-protection law of your country gives you a
        non-waivable right to a different forum. International customers
        agree that this jurisdiction applies to commercial disputes, while
        retaining all rights granted under their local consumer law.
      </P>

      <H2>14. Changes to the Terms</H2>
      <P>
        We may update these Terms from time to time. For material changes we
        will notify you by email at least 30 days in advance. Continued use of
        the Service after the effective date constitutes acceptance.
      </P>

      <H2>15. Contact</H2>
      <P>
        Questions about these Terms? Email{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-primary hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
        {" "}or visit our{" "}
        <Link href="/contact" className="text-primary hover:underline">
          contact page
        </Link>
        .
      </P>
    </LegalLayout>
  );
}
